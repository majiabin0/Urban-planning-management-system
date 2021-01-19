// @ts-nocheck
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import { Helmet, useIntl, withRouter, connect, useModel, history } from "umi";
import Header from "@/components/Header";
import Upload from "@/components/Upload";
import Editor from "@/components/Editor";
import Extra from "@/components/Extra";
import ExtraArray from "@/components/ExtraArray";
import {
  Layout,
  Form,
  Input,
  Select,
  Row,
  Col,
  TreeSelect,
  InputNumber,
  Button,
  Spin,
  Tooltip,
  message
} from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import { aesEncrypt, extraDefault } from "@/utils";
import * as services from "@/services/article";

const Page: React.FC<{
  article: any;
  type: any;
  loading: any;
  dispatch: any;
  location: any;
}> = ({ article, type, loading, dispatch, location }) => {
  const { initialState } = useModel("@@initialState");

  const { types, typeDetail } = type;

  const fomrRef = useRef(null);

  const { formatMessage } = useIntl();

  const [articleId, setArticleId] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const [isLink, setIsLink] = useState(0);
  const [isSticky, setIsSticky] = useState(0);
  const [showLink, setShowLink] = useState(false);
  const [thumb, setThumb] = useState("");
  const [uploadThumb, setUploadThumb] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(null);
  const [extra, setExtra] = useState([]);

  useEffect(() => {
    const { id, siteId, typeId } = location.query;
    setArticleId(id);
    setSiteId(siteId);
    setTypeId(typeId);
    return () => {
      setArticleId(null);
      setSiteId(null);
      setTypeId(null);
    };
  }, [location.query]);

  const initValues = () => {
    if (fomrRef.current) {
      // @ts-ignore
      fomrRef.current.setFieldsValue({
        title: "",
        articleTypeId: "",
        source: "",
        priority: "",
        isLink: 0,
        isSticky: 0,
        image: "",
        link: "",
        description: "",
        content: ""
      });
      if (extra.length > 0) {
        extra.forEach(item => {
          fomrRef.current.setFieldsValue({
            [item.field]: extraDefault(item.type)
          });
        });
      }
    }
    setIsLink(0);
    setIsSticky(0);
    setThumb("");
    setContent(null);
  };

  // 根据内容ID读取内容详细信息（编辑内容时）
  // 如果内容ID时有效数据
  //    读取详细信息
  // 如果内容ID无效时
  //    初始化表单数据到默认状态（新加内容时）
  useEffect(() => {
    if (articleId) {
      dispatch({
        type: "article/getDetail",
        payload: {
          // @ts-ignore
          id: aesEncrypt(articleId, initialState.keys.aes)
        }
      });
    } else {
      initValues();
    }
    return () => {};
  }, [articleId]);

  // 如果存在文章详情时
  useEffect(() => {
    if (article.articleDetail) {
      if (fomrRef.current) {
        // @ts-ignore
        fomrRef.current.setFieldsValue({
          title: article.articleDetail.title,
          articleTypeId: article.articleDetail.articleTypeId,
          source: article.articleDetail.source,
          priority: article.articleDetail.priority,
          isLink: article.articleDetail.isLink ? 1 : 0,
          isSticky: article.articleDetail.isSticky ? 1 : 0,
          image: article.articleDetail.image,
          link: article.articleDetail.link,
          description: article.articleDetail.description,
          content: article.articleDetail.content
        });
        if (article.articleDetail.extras) {
          fomrRef.current.setFieldsValue(article.articleDetail.extras);
        }
      }
      setIsLink(article.articleDetail.isLink ? 1 : 0);
      setIsSticky(article.articleDetail.isSticky ? 1 : 0);
      if (article.articleDetail.image) {
        setThumb(initialState?.cdn + article.articleDetail.image);
      }
      setContent(article.articleDetail.content);
    }
    return () => {
      initValues();
    };
  }, [article.articleDetail]);

  // 如果栏目设置了扩展字段
  useEffect(() => {
    if (typeDetail) {
      if (typeDetail.extra) {
        setExtra(JSON.parse(typeDetail.extra));
      }
      return () => {
        setExtra([]);
      };
    }
  }, [typeDetail]);

  useEffect(() => {
    if (!types && siteId && siteId !== "") {
      dispatch({
        type: "type/getTypes",
        payload: {
          // @ts-ignore
          siteId: aesEncrypt(siteId, initialState.keys.aes)
        }
      });
    }
    return () => {};
  }, [siteId]);

  useEffect(() => {
    if (types && Array.isArray(types) && types.length > 0) {
      if (fomrRef.current) {
        // @ts-ignore
        fomrRef.current.setFieldsValue({
          articleTypeId: Number(typeId)
        });
      }
    }
    if (typeId) {
      dispatch({
        type: "type/getDetail",
        payload: {
          // @ts-ignore
          id: aesEncrypt(typeId, initialState?.keys.aes)
        }
      });
    }
    return () => {};
  }, [types, typeId]);

  useEffect(() => {
    setShowLink(isLink == 1 ? true : false);
    if (fomrRef.current) {
      // @ts-ignore
      fomrRef.current.setFieldsValue({
        isLink
      });
    }
    return () => {
      setShowLink(false);
    };
  }, [isLink]);

  useEffect(() => {
    if (fomrRef.current) {
      // @ts-ignore
      fomrRef.current.setFieldsValue({
        isSticky
      });
    }
    return () => {};
  }, [isSticky]);

  const typesTreeData = (data: any[]): any[] => {
    return data.map((item: any) => ({
      title: item.name,
      key: item.id,
      value: item.id,
      children: Array.isArray(item.children) ? typesTreeData(item.children) : []
    }));
  };

  const save = (values: any) => {
    let data: {
      [key: string]: any;
    } = {};
    if (extra && Array.isArray(extra) && extra.length > 0) {
      let extraValue = {};
      extra.forEach(item => {
        extraValue[item.field] = values[item.field];
        delete values[item.field];
      });
      data["extra"] = aesEncrypt(
        JSON.stringify(extraValue),
        initialState.keys.aes
      );
    }
    // @ts-ignore
    if (typeof values.content === "object") {
      values.content = values.content.toHTML();
    }
    Object.keys(values).forEach(key => {
      if (typeof values[key] !== "undefined") {
        if (key == "isLink" || key == "isSticky") {
          values[key] = values[key] == 1 ? 1 : 0;
        }
        if (typeof values[key] !== "string" && values[key]) {
          if (Array.isArray(values[key]) || typeof values[key] === "object") {
            values[key] = JSON.stringify(values[key]);
          } else {
            values[key] = String(values[key]);
          }
        }
        if (values[key] !== null) {
          // @ts-ignore
          data[key] = aesEncrypt(values[key], initialState.keys.aes);
        }
      }
    });
    setSaving(true);
    const hide = message.loading("正在保存...", 0);
    if (articleId) {
      // @ts-ignore
      data["id"] = aesEncrypt(articleId, initialState.keys.aes);
      services
        .updateArticle(data)
        .then(() => {
          setSaving(false);
          hide();
          history.goBack();
        })
        .catch(() => {
          setSaving(false);
          hide();
        });
    } else {
      services
        .addArticle(data)
        .then(() => {
          setSaving(false);
          hide();
          history.goBack();
        })
        .catch(() => {
          setSaving(false);
          hide();
        });
    }
  };

  useEffect(() => {
    const PCOE = document.getElementById("PageContentOfEditor");
    const EditorBAR = document.querySelector(".bf-controlbar");
    PCOE?.addEventListener("scroll", e => {
      // @ts-ignore
      const scrollTop = e.target?.scrollTop
        ? // @ts-ignore
          e.target?.scrollTop
        : null;
      if (scrollTop !== null) {
        let offset = document.getElementById("formbase")?.clientHeight;
        offset = offset ? offset + 45 : 380;
        if (scrollTop > offset) {
          if (!EditorBAR?.classList.contains("fixed-bar")) {
            EditorBAR?.classList.add("fixed-bar");
          }
        } else {
          if (EditorBAR?.classList.contains("fixed-bar")) {
            EditorBAR?.classList.remove("fixed-bar");
          }
        }
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {formatMessage({
            id: articleId ? "action.edit.acticle" : "action.add.acticle"
          })}
        </title>
      </Helmet>
      <Header
        title={formatMessage({
          id: articleId ? "action.edit.acticle" : "action.add.acticle"
        })}
        style={{
          borderBottom: "1px solid #eee"
        }}
      />
      <Layout.Content
        style={{
          padding: "18px 24px 0",
          flex: "1 1 auto",
          overflow: "auto"
        }}
        id="PageContentOfEditor"
      >
        <Spin
          spinning={
            (articleId ? loading.models.article : false) || loading.models.type
          }
        >
          <Form ref={fomrRef} layout="vertical" onFinish={save}>
            <div id="formbase">
              <Row gutter={24}>
                <Col span={17}>
                  <Row gutter={24}>
                    <Col span={16}>
                      <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true }]}
                      >
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="栏目"
                        name="articleTypeId"
                        rules={[{ required: true }]}
                      >
                        <TreeSelect
                          showSearch
                          size="large"
                          style={{ width: "100%" }}
                          placeholder={formatMessage({
                            id: "tips.select.type"
                          })}
                          treeData={
                            types && Array.isArray(types)
                              ? typesTreeData(types)
                              : []
                          }
                          // disabled
                          onChange={value => {
                            setTypeId(value);
                          }}
                        ></TreeSelect>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="来源" name="source">
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        label="外链文章"
                        name="isLink"
                        initialValue={isLink}
                      >
                        <Select
                          size="large"
                          style={{
                            width: "100%"
                          }}
                          // @ts-ignore
                          onChange={value => setIsLink(value)}
                        >
                          <Select.Option value={1}>是</Select.Option>
                          <Select.Option value={0}>否</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        label={
                          <>
                            <span>权重</span>
                            <Tooltip title="值越大排序越靠前">
                              <InfoCircleFilled
                                style={{
                                  marginTop: -2,
                                  marginLeft: 4,
                                  opacity: 0.5
                                }}
                              />
                            </Tooltip>
                          </>
                        }
                        name="priority"
                      >
                        <InputNumber size="large" style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="是否置顶"
                        name="isSticky"
                        initialValue={isSticky}
                      >
                        <Select
                          size="large"
                          style={{
                            width: "100%"
                          }}
                          // @ts-ignore
                          onChange={value => setIsSticky(value)}
                        >
                          <Select.Option value={1}>置顶</Select.Option>
                          <Select.Option value={0}>不置顶</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    {showLink ? (
                      <Col span={24}>
                        <Form.Item
                          label="外链地址"
                          name="link"
                          rules={[{ required: showLink }]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      </Col>
                    ) : null}
                    {!showLink ? (
                      <Col span={24}>
                        <Form.Item
                          label="内容摘要"
                          name="description"
                          rules={[{ required: true }]}
                        >
                          <Input.TextArea rows={3} />
                        </Form.Item>
                      </Col>
                    ) : null}
                  </Row>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label="缩略图"
                    name="image"
                    rules={[{ required: true }]}
                  >
                    <Spin tip="正在上传" spinning={uploadThumb}>
                      <div
                        style={{
                          width: "100%",
                          height: showLink ? "242px" : "277px",
                          position: "relative"
                        }}
                      >
                        <div
                          style={{
                            backgroundImage: `url(${thumb})`,
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
                          size="1M"
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
                            typeDetail &&
                            typeDetail.thumbWidth &&
                            typeDetail.thumbHeight
                              ? {
                                  aspect:
                                    typeDetail.thumbWidth /
                                    typeDetail.thumbHeight
                                }
                              : false
                          }
                          disabled={uploadThumb}
                          multiple={false}
                          antd={{
                            showUploadList: false
                          }}
                          onStart={(file: any) => {
                            setUploadThumb(true);
                            setThumb(URL.createObjectURL(file));
                          }}
                          onCompleted={(res: any, file: any) => {
                            setUploadThumb(false);
                            const { data } = res;
                            if (data.url) {
                              setThumb(initialState?.cdn + data.url);
                              if (fomrRef.current) {
                                // @ts-ignore
                                fomrRef.current.setFieldsValue({
                                  image: data.url
                                });
                              }
                            }
                          }}
                        ></Upload>
                      </div>
                    </Spin>
                  </Form.Item>
                </Col>
              </Row>
              {showLink ? (
                <Col span={24}>
                  <Form.Item
                    label="内容摘要"
                    name="description"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </Col>
              ) : null}
              {extra.length > 0
                ? extra.map((item, key) => {
                    return (
                      <div key={key}>
                        {item.type == "array" ? (
                          <ExtraArray options={item} />
                        ) : (
                          <Form.Item
                            label={item.name}
                            name={item.field}
                            rules={[{ required: item.required }]}
                          >
                            <Extra options={item} />
                          </Form.Item>
                        )}
                      </div>
                    );
                  })
                : null}
            </div>
            {!showLink ? (
              <Form.Item
                label="正文内容"
                name="content"
                rules={[{ required: !showLink }]}
                style={{
                  marginBottom: 0
                }}
              >
                <Editor
                  style={{
                    height: "auto",
                    marginLeft: "-24px",
                    marginRight: "-24px"
                  }}
                  // @ts-ignore
                  initialValue={content}
                  // previewHtml={previewHtml}
                  onChange={(state: any) => {
                    if (fomrRef.current) {
                      // @ts-ignore
                      fomrRef.current.setFieldsValue({
                        content: state.toHTML()
                      });
                    }
                  }}
                />
              </Form.Item>
            ) : null}
          </Form>
        </Spin>
      </Layout.Content>
      <Layout.Footer
        className="d-flex align-items-center justify-content-flex-end"
        style={{
          height: "80px",
          boxShadow: "0 -2px 12px rgba(25, 25, 25, .08)",
          position: "relative",
          zIndex: 1
        }}
      >
        <Button
          type="primary"
          size="large"
          onClick={() => {
            if (fomrRef.current) {
              // @ts-ignore
              fomrRef.current.submit();
            }
          }}
          disabled={articleId ? loading.models.article : false}
          loading={saving}
        >
          保存
        </Button>
      </Layout.Footer>
    </>
  );
};

export default withRouter(
  connect(({ article, type, loading }: any) => ({
    article,
    type,
    loading
  }))(Page)
);
