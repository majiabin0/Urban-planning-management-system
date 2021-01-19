import React, { useEffect, useState } from "react";
import { useModel } from "umi";
import { Input, Select, Button, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Upload from "@/components/Upload";

const Extra: React.FC<{
  options: {
    type: String;
    multiple?: Boolean;
    options?: any[];
    size?: any;
    accept?: any;
    crop?: any;
  };
  value?: any;
  size?: "large" | "middle" | "small";
  onChange?: Function;
}> = ({ options, value, size, onChange }) => {
  const { initialState } = useModel("@@initialState");

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (options.type == "upload" && typeof value === "string") {
      value = [value];
    }
    if (value && Array.isArray(value)) {
      if (options.type == "images" || options.type == "upload") {
        let valueTemp = JSON.parse(JSON.stringify(value));
        valueTemp = valueTemp.map((file: any, i: any) => {
          if (typeof file === "string") {
            return {
              uid: file + "__" + i,
              name: file.split("/").pop(),
              status: "done",
              url: initialState?.cdn + file
            };
          }
        });
        setFileList(valueTemp);
      }
    }
    return () => {
      setFileList([]);
    };
  }, [value]);

  let Dom = (
    <Input
      value={value}
      size={size}
      onChange={e => {
        onChange && onChange(e.target.value);
      }}
    />
  );
  if (options.type == "select") {
    Dom = (
      <Select
        value={value}
        mode={options.multiple ? "multiple" : undefined}
        size={size}
        onChange={values => {
          onChange && onChange(values);
        }}
      >
        {options.options &&
          options.options.map((option, k) => {
            return (
              <Select.Option key={k} value={option.value}>
                {option.name}
              </Select.Option>
            );
          })}
      </Select>
    );
  } else if (options.type == "images") {
    Dom = (
      <div>
        <Upload
          chunk
          drop
          accept={[
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/webp"
          ]}
          crop={
            options.size &&
            Array.isArray(options.size) &&
            options.size.length == 2
              ? {
                  aspect: options.size[0] / options.size[1]
                }
              : false
          }
          multiple={false}
          antd={{
            showUploadList: true,
            listType: "picture",
            fileList: fileList,
            onChange: ({ file }: any) => {
              if (value && Array.isArray(value)) {
                const index = value.findIndex(item => {
                  if (typeof item === "string") {
                    return file.uid.indexOf(item + "__") === 0;
                  }
                  return file.uid === item.uid;
                });
                if (index !== -1) {
                  let tempVal = JSON.parse(JSON.stringify(value));
                  tempVal.splice(index, 1);
                  Object.preventExtensions(tempVal);
                  onChange && onChange(tempVal);
                }
              }
            }
          }}
          onStart={(file: any) => {
            setFileList(val => {
              let tempVal = JSON.parse(JSON.stringify(val));
              tempVal.push({
                uid: file.uid,
                name: file.name,
                status: "uploading",
                url: URL.createObjectURL(file)
              });
              Object.preventExtensions(tempVal);
              return tempVal;
            });
          }}
          onCompleted={(res: any, file: any) => {
            const { data } = res;
            if (data.url) {
              let tempVal = [];
              if (Array.isArray(value)) {
                tempVal = JSON.parse(JSON.stringify(value));
              }
              const findIndex = tempVal.findIndex(
                (item: any) => typeof item !== "string" && item.uid === file.uid
              );
              if (findIndex !== -1) {
                tempVal[findIndex] = data.url;
              } else {
                tempVal.push(data.url);
              }
              Object.preventExtensions(tempVal);
              onChange && onChange(tempVal);
            }
          }}
        >
          拖拽或选择上传图片
        </Upload>
      </div>
    );
  } else if (options.type == "image") {
    Dom = (
      <Spin tip="正在上传" spinning={uploading}>
        <div
          style={{
            width: "100%",
            height: "280px",
            position: "relative"
          }}
        >
          <div
            style={{
              backgroundImage: `url(${
                value && value.indexOf("/") === 0
                  ? initialState?.cdn + value
                  : value
              })`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              position: "absolute",
              top: "1px",
              left: "1px",
              right: "1px",
              bottom: "1px",
              zIndex: 1,
              pointerEvents: "none"
            }}
          ></div>
          <Upload
            chunk
            drop
            accept={[
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/bmp",
              "image/webp"
            ]}
            crop={
              options.size &&
              Array.isArray(options.size) &&
              options.size.length == 2
                ? {
                    aspect: options.size[0] / options.size[1]
                  }
                : false
            }
            disabled={uploading}
            multiple={false}
            antd={{
              showUploadList: false
            }}
            onStart={(file: any) => {
              setUploading(true);
              onChange && onChange(URL.createObjectURL(file));
            }}
            onCompleted={(res: any, file: any) => {
              setUploading(false);
              const { data } = res;
              if (data.url) {
                onChange && onChange(data.url);
              }
            }}
          ></Upload>
        </div>
      </Spin>
    );
  } else if (options.type == "part") {
    Dom = (
      <Input.TextArea
        value={value}
        autoSize={{
          minRows: 3
        }}
        className={size == "large" ? "mooween-input-lg" : ""}
        onChange={e => {
          onChange && onChange(e.target.value);
        }}
      />
    );
  } else if (options.type == "upload") {
    Dom = (
      <div>
        <Upload
          size={options.size}
          chunk
          drop={false}
          accept={options.accept}
          crop={
            !options.multiple &&
            options.crop &&
            Array.isArray(options.crop) &&
            options.crop.length == 2
              ? {
                  aspect: options.crop[0] / options.crop[1]
                }
              : false
          }
          multiple={options.multiple ? Boolean(options.multiple) : false}
          antd={{
            showUploadList: true,
            listType: "text",
            fileList: fileList,
            beforeUpload: () => {
              if (!options.multiple) {
                if (fileList.length > 0) {
                  return false;
                }
              }
              return true;
            },
            onChange: ({ file }: any) => {
              if (typeof value === "string") {
                value = [value];
              }
              if (value && Array.isArray(value)) {
                const index = value.findIndex(item => {
                  if (typeof item === "string") {
                    return file.uid.indexOf(item + "__") === 0;
                  }
                  return file.uid === item.uid;
                });
                if (index !== -1) {
                  let tempVal = JSON.parse(JSON.stringify(value));
                  tempVal.splice(index, 1);
                  Object.preventExtensions(tempVal);
                  onChange && onChange(tempVal);
                }
              }
            }
          }}
          onStart={(file: any) => {
            if (options.multiple) {
              setFileList(val => {
                let tempVal = JSON.parse(JSON.stringify(val));
                tempVal.push({
                  uid: file.uid,
                  name: file.name,
                  status: "uploading",
                  url: URL.createObjectURL(file)
                });
                Object.preventExtensions(tempVal);
                return tempVal;
              });
            } else {
              setFileList(val => {
                let tempVal = JSON.parse(JSON.stringify(val));
                tempVal = [
                  {
                    uid: file.uid,
                    name: file.name,
                    status: "uploading",
                    url: URL.createObjectURL(file)
                  }
                ];
                Object.preventExtensions(tempVal);
                return tempVal;
              });
            }
          }}
          onCompleted={(res: any, file: any) => {
            const { data } = res;
            if (data.url) {
              if (options.multiple) {
                let tempVal = [];
                if (Array.isArray(value)) {
                  tempVal = JSON.parse(JSON.stringify(value));
                }
                const findIndex = tempVal.findIndex(
                  (item: any) =>
                    typeof item !== "string" && item.uid === file.uid
                );
                if (findIndex !== -1) {
                  tempVal[findIndex] = data.url;
                } else {
                  tempVal.push(data.url);
                }
                Object.preventExtensions(tempVal);
                onChange && onChange(tempVal);
              } else {
                onChange && onChange(data.url);
              }
            }
          }}
        >
          <Button icon={<UploadOutlined />}>上传文件</Button>
        </Upload>
      </div>
    );
  }
  return Dom;
};

Extra.defaultProps = {
  size: "large"
};

export default Extra;
