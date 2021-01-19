import React, { useState, useEffect, useRef, useCallback } from "react";
import BraftEditor from "braft-editor";
// @ts-ignore
import { ContentUtils } from "braft-utils";
// @ts-ignore
import ColorPicker from "braft-extensions/dist/color-picker";
// import { v4 as uuidv4 } from 'uuid'
import Icon from "./Icon";
import styles from "./styles/Editor.less";
import { useModel } from "umi";
import { Modal, Input, Button, Switch, Tooltip } from "antd";
import {
  LoadingOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import Upload from "./Upload";
import QueueAnim from "rc-queue-anim";
import "braft-editor/dist/index.css";
import "braft-extensions/dist/color-picker.css";

const FileExtension = {
  type: "entity",
  name: "file-item",
  control: false,
  mutability: "FILE-ITEM",
  data: {
    filename: "",
    filesize: "",
    fileurl: ""
  },
  component: (props: any) => {
    const entity = props.contentState.getEntity(props.entityKey);
    const { filename, filesize, fileurl } = entity.getData();
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          minWidth: "260px",
          padding: "12px 24px",
          border: "1px solid #eee",
          borderRadius: "3px"
        }}
      >
        <div style={{ marginRight: "16px" }}>
          <DownloadOutlined size={32} />
        </div>
        <div>
          <div
            style={{
              fontSize: "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            <a href={fileurl}>{filename}</a>
          </div>
          <span style={{ fontSize: "12px", opacity: ".5" }}>{filesize}</span>
        </div>
      </div>
    );
  },
  importer: (nodeName: any, node: any, source: any) => {
    if (
      nodeName.toLowerCase() === "span" &&
      node.classList &&
      node.classList.contains("file-item")
    ) {
      return {
        mutability: "FILE-ITEM",
        data: {
          filename: node.dataset.filename,
          filesize: node.dataset.filesize,
          fileurl: node.dataset.fileurl
        }
      };
    }
  },
  exporter: (entityObject: any, originalText: any) => {
    const { filename, filesize, fileurl } = entityObject.data;
    return (
      <span
        data-filename={filename}
        data-filesize={filesize}
        data-fileurl={fileurl}
        className="file-item"
      >
        {originalText}
      </span>
    );
  }
};

BraftEditor.use(
  ColorPicker({
    theme: "dark"
  })
);

BraftEditor.use(FileExtension);

const Editor: React.FC<{
  initialValue?: string;
  controls?: any[];
  style?: {};
  onChange?: Function;
  previewHtml?: Function;
}> = props => {
  const { initialState } = useModel("@@initialState");

  const editor = useRef(null);
  const editorWrap = useRef(null);
  const textAlignDropdown = useRef(null);
  const insertDropdown = useRef(null);

  const [editorState, setEditorState] = useState(
    BraftEditor.createEditorState(
      props.initialValue ? props.initialValue : null
    )
  );
  const [currentAlignment, setCurrentAlignment] = useState<string | undefined>(
    undefined
  );
  const [textSelected, setTextSelected] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [visibleInsertLink, setVisibleInsertLink] = useState(false);
  const [link, setLink] = useState("");
  const [linkTarget, setLinkTarget] = useState("");
  const [uploadList, setUploadList] = useState<any>({});

  const hooks = {
    "toggle-text-alignment": (alignment: string | null) => {}
  };

  const onChange = (editorState: any) => {
    setEditorState(editorState);
    setCurrentAlignment(
      ContentUtils.getSelectionBlockData(editorState, "textAlign")
    );
    setTextSelected(
      !ContentUtils.isSelectionCollapsed(editorState) &&
        ContentUtils.getSelectionBlockType(editorState) !== "atomic"
    );
    const { href, target } = ContentUtils.getSelectionEntityData(
      editorState,
      "LINK"
    );
    setLink(href);
    setLinkTarget(target);
    props.onChange && props.onChange(editorState);
  };

  useEffect(() => {
    if (props.initialValue && props.initialValue !== "") {
      setEditorState(BraftEditor.createEditorState(props.initialValue));
    }
    return () => {
      setEditorState(BraftEditor.createEditorState(null));
    };
  }, [props.initialValue]);

  useEffect(() => {
    setSelectedText("");
    if (textSelected) {
      setSelectedText(ContentUtils.getSelectionText(editorState));
    }
    return () => {};
  }, [textSelected]);

  const setAlignment = (alignment: string) => {
    onChange(ContentUtils.toggleSelectionAlignment(editorState, alignment));
    if (alignment === currentAlignment) {
      setCurrentAlignment(undefined);
    } else {
      setCurrentAlignment(alignment);
    }
    if (textAlignDropdown.current) {
      // @ts-ignore
      textAlignDropdown.current.props.hooks(
        "toggle-text-alignment",
        alignment
      )(alignment);
      // @ts-ignore
      textAlignDropdown.current.hide();
    }
  };

  const increaseIndent = () => {
    onChange(ContentUtils.increaseSelectionIndent(editorState));
  };

  const decreaseIndent = () => {
    onChange(ContentUtils.decreaseSelectionIndent(editorState));
  };

  const insertBlockquote = () => {
    onChange(ContentUtils.toggleSelectionBlockType(editorState, "blockquote"));
    if (insertDropdown.current) {
      // @ts-ignore
      insertDropdown.current.props.hooks(
        "change-block-type",
        "blockquote"
      )("blockquote");
      // @ts-ignore
      insertDropdown.current.hide();
    }
  };

  const insertLink = () => {
    if (!textSelected) {
      return;
    }
    setVisibleInsertLink(true);
    if (insertDropdown.current) {
      // @ts-ignore
      insertDropdown.current.hide();
    }
  };

  const uninsertLink = () => {
    if (insertDropdown.current) {
      // @ts-ignore
      insertDropdown.current.hide();
    }
    onChange(ContentUtils.toggleSelectionLink(editorState, false));
  };

  const startUploadFile = (file: any) => {
    setUploadList((state: any) => {
      let list: any = {};
      Object.keys(state).forEach(key => {
        list[key] = state[key];
      });
      let url = "";
      if (
        file.type.indexOf("image/") === 0 ||
        file.type.indexOf("video/") === 0
      ) {
        url = URL.createObjectURL(file);
      }
      list[file.uid] = {
        file,
        status: "start",
        url: url
      };
      return list;
    });
    if (insertDropdown.current) {
      // @ts-ignore
      insertDropdown.current.hide();
    }
    if (editor.current) {
      // @ts-ignore
      editor.current.requestFocus();
    }
  };

  const completedUploadFile = (res: any, file: any) => {
    const { data } = res;
    setTimeout(() => {
      setUploadList((state: any) => {
        let list: any = {};
        Object.keys(state).forEach(key => {
          list[key] = state[key];
        });
        if (list[file.uid]) {
          list[file.uid] = {
            file,
            status: "completed",
            url: initialState?.cdn + data.url
          };
        }
        return list;
      });
    }, 5000);
  };

  const insertFile = (item: any) => {
    const { file, url } = item;
    if (
      file.type.indexOf("image/") === 0 ||
      file.type.indexOf("video/") === 0
    ) {
      onChange(
        ContentUtils.insertMedias(editorState, [
          {
            type: file.type.indexOf("image/") === 0 ? "IMAGE" : "VIDEO",
            url: url
          }
        ])
      );
    } else {
      onChange(
        ContentUtils.insertHTML(
          editorState,
          `<span class="file-item" data-filesize="${
            file.size / 1024 > 1024
              ? Math.round(file.size / 1024 / 1024).toFixed(2) + "M"
              : Math.round(file.size / 1024).toFixed(2) + "K"
          }" data-fileurl="${url}" data-filename="${file.name}">${
            file.name
          }</span>`
        )
      );
    }
  };

  const confirmInsertLink = useCallback(() => {
    const href = link;
    const target = linkTarget;
    if (insertDropdown.current) {
      // @ts-ignore
      insertDropdown.current.props.hooks("toggle-link", { href, target })({
        href,
        target
      });
    }
    if (editor.current) {
      // @ts-ignore
      editor.current.requestFocus();
    }
    if (textSelected) {
      if (href) {
        onChange(ContentUtils.toggleSelectionLink(editorState, href, target));
      } else {
        onChange(ContentUtils.toggleSelectionLink(editorState, false));
      }
    } else {
      onChange(
        ContentUtils.insertText(editorState, selectedText || href, null, {
          type: "LINK",
          data: { href, target }
        })
      );
    }
    setVisibleInsertLink(false);
  }, [editorState, textSelected, link, linkTarget]);

  const preview = useCallback(() => {
    if (props.previewHtml) {
      // @ts-ignore
      if (window.previewWindow) {
        // @ts-ignore
        window.previewWindow.close();
      }

      // @ts-ignore
      window.previewWindow = window.open();
      // @ts-ignore
      window.previewWindow.document.write(
        props.previewHtml(editorState.toHTML())
      );
      // @ts-ignore
      window.previewWindow.document.close();
    }
  }, [editorState]);

  let controls = [
    { key: "undo", text: <Icon type="arrow-go-back-line" /> },
    { key: "redo", text: <Icon type="arrow-go-forward-line" /> },
    { key: "remove-styles", text: <Icon type="eraser-fill" /> },
    "separator",
    /* 插入 */
    "headings",
    "font-size",
    "separator",
    { key: "bold", text: <Icon type="bold" /> },
    { key: "italic", text: <Icon type="italic" /> },
    { key: "underline", text: <Icon type="underline" /> },
    { key: "strike-through", text: <Icon type="strikethrough" /> },
    "text-color",
    "separator",
    {
      key: "insert",
      type: "dropdown",
      title: "插入",
      text: (
        <>
          <Icon type="add-circle-line" style={{ marginRight: "5px" }} />
          插入
        </>
      ),
      showArrow: true,
      arrowActive: false,
      autoHide: true,
      ref: insertDropdown,
      component: (
        <ul className="bf-font-sizes insert">
          <Upload
            chunk
            drop={false}
            accept={[
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/bmp",
              "image/webp",
              "video/mp4"
            ]}
            antd={{
              showUploadList: false
            }}
            onStart={startUploadFile}
            onCompleted={completedUploadFile}
          >
            <li>
              <Icon
                type="image-line"
                style={{ marginLeft: "10px", marginRight: "8px" }}
              />
              图片/视频
            </li>
          </Upload>
          <Upload
            chunk
            drop={false}
            accept={[
              "text/plain",
              "application/pdf",
              "application/zip",
              "application/x-rar-compressed",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "application/vnd.ms-powerpoint",
              "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            ]}
            antd={{
              showUploadList: false
            }}
            onStart={startUploadFile}
            onCompleted={completedUploadFile}
          >
            <li>
              <Icon
                type="attachment-2"
                style={{ marginLeft: "10px", marginRight: "8px" }}
              />
              附件
            </li>
          </Upload>
          {/* <li>
            <Icon
              type="table-2"
              style={{ marginLeft: "10px", marginRight: "8px" }}
            />
            表格
          </li> */}
          <li onClick={insertLink} className={!textSelected ? "disabled" : ""}>
            <Icon
              type="link"
              style={{ marginLeft: "10px", marginRight: "8px" }}
            />
            链接
          </li>
          {link && textSelected ? (
            <li onClick={uninsertLink}>
              <Icon
                type="link-unlink"
                style={{ marginLeft: "10px", marginRight: "8px" }}
              />
              取消链接
            </li>
          ) : null}
          <li onClick={insertBlockquote}>
            <Icon
              type="double-quotes-l"
              style={{ marginLeft: "10px", marginRight: "8px" }}
            />
            引用
          </li>
        </ul>
      )
    },
    "separator",
    {
      key: "text-align",
      type: "dropdown",
      title: "对齐",
      text: <Icon type="align-left" />,
      showArrow: true,
      arrowActive: false,
      autoHide: true,
      ref: textAlignDropdown,
      component: (
        <ul className="bf-font-sizes">
          <li
            className={currentAlignment === "left" ? "active" : ""}
            onClick={setAlignment.bind(this, "left")}
          >
            <Icon type="align-left" />
          </li>
          <li
            className={currentAlignment === "center" ? "active" : ""}
            onClick={setAlignment.bind(this, "center")}
          >
            <Icon type="align-center" />
          </li>
          <li
            className={currentAlignment === "right" ? "active" : ""}
            onClick={setAlignment.bind(this, "right")}
          >
            <Icon type="align-right" />
          </li>
          <li
            className={currentAlignment === "justify" ? "active" : ""}
            onClick={setAlignment.bind(this, "justify")}
          >
            <Icon type="align-justify" />
          </li>
        </ul>
      )
    },
    { key: "list-ul", text: <Icon type="list-unordered" /> },
    { key: "list-ol", text: <Icon type="list-ordered" /> },
    {
      key: "increase-indent",
      type: "button",
      title: "增加缩进",
      text: <Icon type="indent-increase" />,
      onClick: increaseIndent
    },
    {
      key: "decrease-indent",
      type: "button",
      title: "减少缩进",
      text: <Icon type="indent-decrease" />,
      onClick: decreaseIndent
    },
    "separator",
    "emoji"
    // "separator",
    // {
    //   key: "preview",
    //   type: "button",
    //   text: "预览",
    //   onClick: preview
    // }
  ];

  if (props.controls) {
    controls = props.controls;
  }

  return (
    <>
      <div
        className={styles.editor}
        ref={editorWrap}
        style={props.style ? props.style : {}}
      >
        <BraftEditor
          ref={editor}
          value={editorState}
          hooks={hooks}
          onChange={onChange}
          // @ts-ignore
          controls={controls}
        ></BraftEditor>
        {
          <div className={styles.notification}>
            <QueueAnim delay={100}>
              {Object.keys(uploadList).map(key => (
                <div key={key} className="item">
                  <div className="text">
                    <div className="left">
                      <div className="btns">
                        {uploadList[key].status === "completed" ? (
                          <Tooltip title="添加到正文">
                            <Button
                              type="text"
                              shape="circle"
                              disabled={false}
                              icon={<PlusCircleOutlined />}
                              onClick={() => {
                                insertFile(uploadList[key]);
                                setUploadList((state: any) => {
                                  let list: any = {};
                                  Object.keys(state).forEach(key => {
                                    list[key] = state[key];
                                  });
                                  delete list[key];
                                  return list;
                                });
                              }}
                            ></Button>
                          </Tooltip>
                        ) : (
                          <Button
                            type="text"
                            shape="circle"
                            disabled={true}
                            icon={<LoadingOutlined />}
                          ></Button>
                        )}
                      </div>
                      <div className="name">{uploadList[key].file.name}</div>
                    </div>
                    <div className="btns">
                      <Button
                        type="text"
                        shape="circle"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() =>
                          setUploadList((state: any) => {
                            let list: any = {};
                            Object.keys(state).forEach(key => {
                              list[key] = state[key];
                            });
                            delete list[key];
                            return list;
                          })
                        }
                        danger
                      ></Button>
                    </div>
                  </div>
                  {uploadList[key].url &&
                  uploadList[key].file.type.indexOf("image/") === 0 ? (
                    <div
                      className="thumb"
                      style={{
                        backgroundImage: `url(${uploadList[key].url})`
                      }}
                    ></div>
                  ) : null}
                  {uploadList[key].url &&
                  uploadList[key].file.type.indexOf("video/") === 0 ? (
                    <video controls src={uploadList[key].url}></video>
                  ) : null}
                </div>
              ))}
            </QueueAnim>
          </div>
        }
      </div>
      <Modal
        closable={false}
        footer={false}
        width={400}
        className="mooween-modal-confirm mooween-modal-confirm-confirm"
        visible={visibleInsertLink}
        onCancel={() => {
          setVisibleInsertLink(false);
        }}
      >
        <div className="mooween-modal-confirm-body-wrapper">
          <div className="mooween-modal-confirm-body">
            <div style={{ marginBottom: "20px" }}>
              <strong>插入链接</strong>
            </div>
            <Input
              placeholder="输入链接地址"
              value={link}
              onChange={e => {
                setLink(e.target.value);
              }}
            />
          </div>
          <div
            className="mooween-modal-confirm-btns d-flex align-items-center justify-content-space-between"
            style={{ float: "none" }}
          >
            <div
              className="d-flex align-items-center"
              style={{ lineHeight: 1, fontSize: "13px" }}
            >
              <Switch
                size="small"
                checked={linkTarget == "_blank"}
                style={{ marginRight: "5px" }}
                onChange={value => {
                  setLinkTarget(value ? "_blank" : "");
                }}
              />{" "}
              新窗口打开
            </div>
            <div>
              <Button
                onClick={() => {
                  setVisibleInsertLink(false);
                }}
              >
                取消
              </Button>
              <Button type="primary" onClick={confirmInsertLink}>
                应用
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

Editor.defaultProps = {};

export default Editor;
