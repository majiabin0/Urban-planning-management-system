// @ts-nocheck
import React, { useState, useCallback, useRef } from "react";
import CryptoJS from "crypto-js";
import { Upload as AntUpload, message, Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Cropper from "react-easy-crop";
import { useIntl, request, useModel } from "umi";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileMetadata from "filepond-plugin-file-metadata";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { aesEncrypt } from "@/utils";
import * as services from "@/services/upload";
import styles from "./styles/Upload.less";

import "./styles/Filepond.less";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileMetadata,
  FilePondPluginFileValidateType
);

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const defaultChunkSize = 100 * 1024;
const defaultChunkRetryDelays = [0, 500, 1000, 3000];

const parseChunks = (file: any, chunkSize: number) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    const blobSlice =
      File.prototype.slice ||
      // @ts-ignore
      File.prototype.mozSlice ||
      // @ts-ignore
      File.prototype.webkitSlice;

    let chunks: any[] = [];
    let currentChunk: number = 0;
    let totalChunks: number = Math.ceil(file.size / chunkSize);
    let cryptoJS = CryptoJS.algo.SHA256.create();

    function nextChunk() {
      if (!file) {
        return;
      }
      let begin = currentChunk * chunkSize;
      let end = begin + chunkSize >= file.size ? file.size : begin + chunkSize;
      let blob = blobSlice.call(file, begin, end, file.type);
      if (blob.size > 0) {
        chunks.push(blob);
      }
      fileReader.readAsArrayBuffer(blob);
    }

    nextChunk();

    fileReader.onload = function(e) {
      // @ts-ignore
      cryptoJS.update(CryptoJS.lib.WordArray.create(e.target.result));
      if (currentChunk < totalChunks) {
        currentChunk++;
        nextChunk();
      } else {
        let hash = cryptoJS.finalize().toString();
        resolve({ hash, chunks });
      }
    };

    fileReader.onerror = function(e) {
      reject(e);
    };
  });
};

const Upload: React.FC<{
  server?: string;
  name?: string;
  accept?: string[];
  size?: string; // The size of the upload file limit in K or M.
  disabled?: boolean;
  multiple?: boolean;
  drop?: boolean;
  chunk?:
    | boolean
    | {
        size: number; // The size of a chunk in bytes.
        retryDelays: number[];
      };
  data?: {
    [key: string]: any;
  };
  crop?:
    | boolean
    | {
        // The multiple must be false and the file must be a image.
        aspect?: number;
        size?: {
          width: number;
          height: number;
        };
        quality?: number;
      };
  filepond?: boolean | {};
  antd?: {};
  onStart?: Function;
  onProgress?: Function;
  onCompleted?: Function;
}> = props => {
  const { initialState } = useModel("@@initialState");

  const [files, setFiles] = useState([]);

  const [cropVisible, setCropVisible] = useState(false);
  const [cropImage, setCropImage] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropFile, setCropFile] = useState<any>(null);

  const [cropAddToFilepond, setCropAddToFilepond] = useState(false);
  const [cropLoading, setCropLoading] = useState(false);

  const resolveCrop = useRef(() => {});

  const filepondRef = useRef(null);

  let filepondOptions: boolean | {} = false;
  if (props.filepond !== false) {
    filepondOptions = typeof props.filepond === "object" ? props.filepond : {};
  }

  const quality: number =
    typeof props.crop === "object" && props.crop.quality
      ? props.crop.quality
      : 0.4;

  const { formatMessage, messages } = useIntl();
  const beforeUpload = (file: any) => {
    if (filepondOptions !== false) {
      file = file.file;
    }
    let allowType = true;
    if (props.accept && props.accept.indexOf(file.type) === -1) {
      allowType = false;
      message.error(
        formatMessage(
          { id: "upload.limit.type" },
          { type: props.accept.join(", ") }
        )
      );
    }
    let allowSize = true;
    if (props.size && parseInt(props.size)) {
      let size = parseInt(props.size);
      let unit = props.size.substr(props.size.length - 1, 1);
      if (unit === "K" || unit === "M") {
        let limitSize =
          unit === "M" ? file.size / 1024 / 1024 : file.size / 1024;
        if (limitSize > size) {
          allowSize = false;
          message.error(
            formatMessage({ id: "upload.limit.size" }, { size: props.size })
          );
        }
      }
    }
    if (allowType && allowSize) {
      if (props.crop) {
        if (!props.multiple && file.type.indexOf("image/") === 0) {
          if (filepondOptions !== false && cropAddToFilepond) {
            return true;
          }
          if (filepondOptions !== false) {
            setCropVisible(true);
            setCropFile(file);
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              if (typeof fileReader.result === "string") {
                setCropImage(fileReader.result);
              }
            };
            fileReader.onerror = () => {};
            return false;
          } else {
            return new Promise((resolve, reject) => {
              setCropVisible(true);
              setCropFile(file);
              const fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = () => {
                if (typeof fileReader.result === "string") {
                  setCropImage(fileReader.result);
                  resolveCrop.current = resolve;
                }
              };
              fileReader.onerror = () => {
                reject();
              };
            });
          }
        }
      }
    }
    return allowType && allowSize;
  };

  const handleUpload = (
    url: string,
    name: string,
    file: any,
    signal?: any | null,
    extraData?: { [key: string]: any } | null
  ) => {
    const formdata = new FormData();
    formdata.append(name, file);
    if (props.data && typeof props.data === "object") {
      Object.keys(props.data).forEach(key => {
        if (key !== name && props.data) {
          formdata.append(key, props.data[key]);
        }
      });
    }
    if (extraData && typeof extraData === "object") {
      Object.keys(extraData).forEach(key => {
        formdata.append(key, aesEncrypt(extraData[key], initialState.keys.aes));
      });
    }
    let options: {
      method?: string;
      body?: any;
      prefix?: string;
      signal?: any;
    } = {
      method: "post",
      body: formdata
    };
    if (
      url.indexOf("http://") === 0 ||
      url.indexOf("https://") === 0 ||
      url.indexOf("//") === 0
    ) {
      options["prefix"] = "";
    }
    options["signal"] = signal;
    if (url !== "") {
      return request(url, options);
    }
    return services.upload(options);
  };

  const handleUploadChunks = (
    url: string,
    file: any,
    hash: string,
    chunks: any[],
    length: number,
    chunkRetryDelays: number[],
    onstart?: Function,
    onprogress?: Function
  ) => {
    return new Promise((resolve, reject) => {
      const timeout = (
        url: string,
        file: any,
        hash: string,
        chunks: any[],
        length: number,
        chunkRetryDelays: number[],
        onstart?: Function,
        onprogress?: Function
      ) => {
        const controller = new AbortController();
        const { signal } = controller;
        signal.addEventListener("abort", () => {});
        const chunkLeftover = chunks.reduce(
          (prev, next) => prev + next.size,
          0
        );
        const current = chunks.shift();
        const extraData = {
          chunkHash: hash,
          chunkOffset: [
            file.size - chunkLeftover,
            file.size - chunkLeftover + current.size
          ],
          chunkTotal: file.size,
          chunkType: current.type,
          chunkLength: length,
          chunkIndex: length - chunks.length - 1
        };
        onstart && onstart(controller);
        handleUpload(url, "chunk", current, signal, extraData)
          .then(res => {
            if (chunks.length > 0) {
              onprogress && onprogress(extraData);
              timeout(
                url,
                file,
                hash,
                chunks,
                length,
                chunkRetryDelays,
                onstart,
                onprogress
              );
            } else {
              resolve(res);
            }
          })
          .catch(e => {
            if (e instanceof DOMException) {
              reject(e);
            } else {
              if (chunkRetryDelays.length > 0) {
                const delay = chunkRetryDelays.shift();
                setTimeout(() => {
                  chunks.unshift(current);
                  timeout(
                    url,
                    file,
                    hash,
                    chunks,
                    length,
                    chunkRetryDelays,
                    onstart,
                    onprogress
                  );
                }, delay);
              } else {
                reject(e);
              }
            }
          });
      };
      timeout(
        url,
        file,
        hash,
        chunks,
        length,
        chunkRetryDelays,
        onstart,
        onprogress
      );
    });
  };

  const handleChange = (info: any) => {
    if (filepondOptions !== false) {
      setFiles(info);
    } else {
      setFiles(info.fileList.filter((file: any) => !!file.status));
    }
  };

  const AntUploadOptions = {
    action: props.server,
    name: props.name,
    fileList: files,
    accept: props.accept ? props.accept.join(",") : "",
    disabled: props.disabled,
    multiple: props.multiple,
    beforeUpload: beforeUpload,
    customRequest: ({
      action,
      filename,
      file,
      onError,
      onSuccess,
      onProgress
    }: {
      action: string;
      filename: string;
      file: any;
      onError: any;
      onSuccess: any;
      onProgress: any;
    }) => {
      let controller: any = null;

      let loaded: number = 0;
      let timer: any = null;

      if (props.chunk !== false) {
        const chunkSize =
          typeof props.chunk === "object" && props.chunk.size
            ? props.chunk.size
            : defaultChunkSize;
        const chunkRetryDelays =
          typeof props.chunk === "object" && props.chunk.retryDelays
            ? props.chunk.retryDelays
            : defaultChunkRetryDelays;
        parseChunks(file, chunkSize)
          // @ts-ignore
          .then(({ hash, chunks }) => {
            if (typeof props.onStart === "function") {
              props.onStart(file);
            }
            handleUploadChunks(
              // @ts-ignore
              props.server,
              file,
              hash,
              chunks,
              chunks.length,
              chunkRetryDelays,
              // @ts-ignore
              c => {
                controller = c;
              },
              (data: any) => {
                onProgress(
                  {
                    percent: Math.round(
                      (data.chunkOffset[1] / data.chunkTotal) * 100
                    ).toFixed(2)
                  },
                  file
                );
                if (typeof props.onProgress === "function") {
                  props.onProgress(
                    {
                      percent: Math.round(
                        (data.chunkOffset[1] / data.chunkTotal) * 100
                      ).toFixed(2)
                    },
                    file
                  );
                }
              }
            )
              .then(res => {
                onProgress({ percent: 100 });
                if (typeof props.onProgress === "function") {
                  props.onProgress(
                    {
                      percent: 100
                    },
                    file
                  );
                }
                onSuccess(res, file);
                if (typeof props.onCompleted === "function") {
                  props.onCompleted(res, file);
                }
              })
              .catch(e => {
                onError(e);
              });
          })
          .catch(e => {
            onError(e);
          });
      } else {
        controller = new AbortController();
        const { signal } = controller;
        signal.addEventListener("abort", () => {});
        const handleProgress = () => {
          let timeout = random(10, 30);
          timer = setTimeout(() => {
            loaded += random(1, 5);
            if (loaded > 96) {
              loaded = 96;
            } else {
              onProgress({ percent: loaded }, file);
              if (typeof props.onProgress === "function") {
                props.onProgress(
                  {
                    percent: loaded
                  },
                  file
                );
              }
              handleProgress();
            }
          }, timeout);
        };
        handleProgress();
        if (typeof props.onStart === "function") {
          props.onStart(file);
        }
        handleUpload(action, filename, file, signal)
          .then(res => {
            if (timer) {
              clearTimeout(timer);
            }
            onProgress({ percent: 100 });
            if (typeof props.onProgress === "function") {
              props.onProgress(
                {
                  percent: 100
                },
                file
              );
            }
            onSuccess(res, file);
            if (typeof props.onCompleted === "function") {
              props.onCompleted(res, file);
            }
          })
          .catch(e => {
            if (timer) {
              clearTimeout(timer);
            }
            onError(e);
          });
      }

      return {
        abort() {
          if (timer) {
            clearTimeout(timer);
          }
          controller && controller.abort();
        }
      };
    },
    onChange: handleChange,
    ...props.antd
  };

  const cropperRef = useRef(null);

  let cropperOptions: any = {
    ref: cropperRef,
    image: cropImage,
    crop: crop,
    zoom: zoom,
    aspect:
      typeof props.crop === "object" && props.crop.aspect
        ? props.crop.aspect
        : 1,
    onCropChange: setCrop,
    onZoomChange: setZoom,
    onCropComplete: (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    }
  };
  if (typeof props.crop === "object" && props.crop.size) {
    cropperOptions["cropSize"] = props.crop.size;
  }

  const handleCloseCrop = () => {
    setCropLoading(false);
    setCropVisible(false);
    setCropImage("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCropFile(null);
    setCropAddToFilepond(false);
  };

  const handleCrop = useCallback(async () => {
    setCropLoading(true);

    if (croppedAreaPixels !== null) {
      // @ts-ignore
      const { mediaSize, imageRef } = cropperRef.current;
      const { naturalWidth, naturalHeight } = mediaSize;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const maxLen = Math.sqrt(
          Math.pow(naturalWidth, 2) + Math.pow(naturalHeight, 2)
        );
        canvas.width = maxLen;
        canvas.height = maxLen;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const left = (maxLen - naturalWidth) / 2;
        const top = (maxLen - naturalHeight) / 2;
        ctx.drawImage(imageRef, left, top);

        const maxImgData = ctx.getImageData(0, 0, maxLen, maxLen);
        const { width, height, x, y } = croppedAreaPixels;
        canvas.width = width;
        canvas.height = height;
        ctx.putImageData(
          maxImgData,
          Math.round(-left - x),
          Math.round(-top - y)
        );

        if (cropFile !== null) {
          const { type, name, uid } = cropFile;
          canvas.toBlob(
            async blob => {
              if (blob) {
                handleCloseCrop();
                setCropLoading(false);
                let newFile = new File([blob], name, { type });
                if (filepondOptions !== false) {
                  if (filepondRef) {
                    setCropAddToFilepond(true);
                    filepondRef.current.addFile(newFile);
                  }
                } else {
                  // @ts-ignore
                  newFile.uid = uid;
                  // @ts-ignore
                  return resolveCrop.current(newFile);
                }
              }
            },
            type,
            quality
          );
        }
      }
    }
  }, [
    croppedAreaPixels,
    cropFile,
    quality,
    handleCloseCrop,
    filepondOptions,
    setCropAddToFilepond,
    setCropLoading
  ]);

  return (
    <>
      {filepondOptions !== false ? (
        <FilePond
          ref={filepondRef}
          server={{
            // @ts-ignore
            process: (
              fieldName: string,
              file: any,
              metadata: any,
              load: any,
              error: any,
              progress: any,
              abort: any,
              transfer: any,
              options: any
            ) => {
              let controller: any = null;

              let loaded: number = 0;
              let timer: any = null;
              if (props.chunk !== false) {
                const chunkSize =
                  typeof props.chunk === "object" && props.chunk.size
                    ? props.chunk.size
                    : defaultChunkSize;
                const chunkRetryDelays =
                  typeof props.chunk === "object" && props.chunk.retryDelays
                    ? props.chunk.retryDelays
                    : defaultChunkRetryDelays;
                parseChunks(file, chunkSize)
                  // @ts-ignore
                  .then(({ hash, chunks }) => {
                    if (typeof props.onStart === "function") {
                      props.onStart(file);
                    }
                    handleUploadChunks(
                      // @ts-ignore
                      props.server,
                      file,
                      hash,
                      chunks,
                      chunks.length,
                      chunkRetryDelays,
                      // @ts-ignore
                      c => {
                        controller = c;
                      },
                      (data: any) => {
                        progress(true, data.chunkOffset[1], data.chunkTotal);
                        if (typeof props.onProgress === "function") {
                          props.onProgress(
                            {
                              percent: Math.round(
                                (data.chunkOffset[1] / data.chunkTotal) * 100
                              ).toFixed(2)
                            },
                            file
                          );
                        }
                      }
                    )
                      .then(res => {
                        load(res);
                        if (typeof props.onProgress === "function") {
                          props.onProgress(
                            {
                              percent: 100
                            },
                            file
                          );
                        }
                        if (typeof props.onCompleted === "function") {
                          props.onCompleted(res, file);
                        }
                      })
                      .catch(e => {
                        error(e);
                      });
                  })
                  .catch(e => {
                    error(e);
                  });
              } else {
                controller = new AbortController();
                const { signal } = controller;
                signal.addEventListener("abort", () => {});
                const handleProgress = () => {
                  let timeout = random(10, 30);
                  timer = setTimeout(() => {
                    loaded += random(1, 5);
                    if (loaded > 96) {
                      loaded = 96;
                    } else {
                      progress(true, loaded, 100);
                      if (typeof props.onProgress === "function") {
                        props.onProgress(
                          {
                            percent: loaded
                          },
                          file
                        );
                      }
                      handleProgress();
                    }
                  }, timeout);
                };
                handleProgress();
                if (typeof props.onStart === "function") {
                  props.onStart(file);
                }
                handleUpload(props.server, fieldName, file, signal)
                  .then(res => {
                    if (timer) {
                      clearTimeout(timer);
                    }
                    load(res);
                    if (typeof props.onProgress === "function") {
                      props.onProgress(
                        {
                          percent: 100
                        },
                        file
                      );
                    }
                    if (typeof props.onCompleted === "function") {
                      props.onCompleted(res, file);
                    }
                  })
                  .catch(e => {
                    if (timer) {
                      clearTimeout(timer);
                    }
                    error(e);
                  });
              }
              return {
                abort: () => {
                  if (timer) {
                    clearTimeout(timer);
                  }
                  controller && controller.abort();
                  abort();
                }
              };
            },
            revert: null,
            restore: null,
            load: null,
            fetch: null,
            patch: null
          }}
          name={props.name}
          files={files}
          // @ts-ignore
          onupdatefiles={handleChange}
          acceptedFileTypes={props.accept}
          beforeAddFile={beforeUpload}
          allowMultiple={props.multiple}
          allowDrop={props.drop}
          disabled={props.disabled}
          onaddfile={() => {
            setCropAddToFilepond(false);
          }}
          allowFileMetadata={false}
          {...messages.filepond}
          {...filepondOptions}
        />
      ) : props.drop ? (
        <AntUpload.Dragger {...AntUploadOptions}>
          {props.children}
        </AntUpload.Dragger>
      ) : (
        <AntUpload {...AntUploadOptions}>{props.children}</AntUpload>
      )}
      <Modal
        title={formatMessage({ id: "upload.crop.title" })}
        visible={cropVisible}
        closable={false}
        maskClosable={false}
        // confirmLoading={cropLoading && cropVisible}
        onOk={handleCrop}
        onCancel={() => {
          Modal.confirm({
            title: formatMessage({ id: "tips" }),
            content: formatMessage({ id: "ask.crop.abort" }),
            onCancel: () => {},
            onOk: handleCloseCrop
          });
        }}
      >
        <div className={styles.crop}>
          {cropImage === "" ? (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          ) : (
            <Cropper {...cropperOptions} />
          )}
        </div>
      </Modal>
    </>
  );
};

Upload.defaultProps = {
  server: "",
  name: "file",
  disabled: false,
  multiple: false,
  drop: true,
  chunk: false,
  crop: false,
  filepond: false
};

export default Upload;
