import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Layout,
  Input,
  InputNumber,
  Button,
  Tree,
  Select,
  Empty,
  Dropdown,
  Menu,
  Modal,
  Form,
  TreeSelect,
  Drawer,
  Typography,
  Tooltip,
  Row,
  Col
} from "antd";
import {
  PlusOutlined,
  LoadingOutlined,
  MoreOutlined,
  InfoCircleFilled
} from "@ant-design/icons";
// @ts-ignore
import { useIntl, connect, history, useModel, withRouter } from "umi";
import * as typeServices from "@/services/type";
import { aesEncrypt } from "@/utils";
import styles from "./styles.less";
import Extra from "@/components/Extra";

const getParentId = (id: any, tree: any[]): any => {
  let parentId;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: any) => item.id === id)) {
        parentId = node.id;
      } else if (getParentId(id, node.children)) {
        parentId = getParentId(id, node.children);
      }
    }
  }
  return parentId;
};

let typeList: any[] = [];
const generateTypeList = (data: any[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { id, name } = node;
    typeList.push({ id, name: name });
    if (node.children) {
      generateTypeList(node.children);
    }
  }
};

const SIDE_W = 260;

const Page: React.FC<{
  type: any;
  site: any;
  loading: any;
  dispatch: any;
  history: any;
  location: any;
  match: any;
}> = props => {
  const { initialState } = useModel("@@initialState");

  const typeModalFrom: any = useRef(null);

  const { loading, dispatch } = props;
  const { types } = props.type;
  const { sites } = props.site;

  const [currentSiteId, setCurrentSiteId] = useState<number | null>(null);
  const [activeType, setActiveType] = useState<{
    id?: number;
    parentId?: number;
    name?: string;
    source?: any;
  } | null>(null);
  const [moveType, setMoveType] = useState<boolean>(false);
  const [savingType, setSavingType] = useState<boolean>(false);
  const [expandedTypeIds, setExpandedTypeIds] = useState<any[]>([]);
  const [searchTypeValue, setSearchTypeValue] = useState<string>("");
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);

  useEffect(() => {
    dispatch({
      type: "site/getSites"
    });
    return () => {};
  }, []);

  const getTypes = useCallback(() => {
    dispatch({
      type: "type/getTypes",
      payload: {
        // @ts-ignore
        siteId: aesEncrypt(currentSiteId, initialState.keys.aes),
        // 传输未加密的站点ID给模型用作本地缓存数据
        _siteId: currentSiteId
      }
    });
  }, [currentSiteId]);

  useEffect(() => {
    typeList = [];
    if (Array.isArray(types)) {
      generateTypeList(types);
    }
    return () => {};
  }, [types]);

  const saveType = useCallback(
    values => {
      let data: any = {};
      Object.keys(values).forEach(key => {
        if (typeof values[key] === "string" && values[key] !== "") {
          data[key] = aesEncrypt(values[key], String(initialState?.keys?.aes));
        } else if (typeof values[key] === "object") {
          data[key] = aesEncrypt(
            JSON.stringify(values[key]),
            String(initialState?.keys?.aes)
          );
        } else {
          data[key] = aesEncrypt(
            String(values[key]),
            String(initialState?.keys?.aes)
          );
        }
      });
      data["siteId"] = aesEncrypt(
        String(currentSiteId),
        String(initialState?.keys?.aes)
      );
      setSavingType(true);
      // 任何对栏目的修改前先清除本地的栏目缓存
      if (window && window.sessionStorage) {
        // @ts-ignore
        window.sessionStorage.removeItem(SESSION_TYPES + "_" + currentSiteId);
      }
      if (activeType?.id) {
        typeServices
          .updateType({
            id: aesEncrypt(
              String(activeType.id),
              String(initialState?.keys?.aes)
            ),
            data
          })
          .then(() => {
            setSavingType(false);
            setActiveType(null);
            setMoveType(false);
            getTypes();
          })
          .catch(() => {
            setSavingType(false);
          });
      } else {
        typeServices
          .addType({
            name: data["name"],
            data
          })
          .then(() => {
            setSavingType(false);
            setActiveType(null);
            getTypes();
          })
          .catch(() => {
            setSavingType(false);
          });
      }
    },
    [currentSiteId, activeType]
  );

  useEffect(() => {
    if (currentSiteId) {
      getTypes();
    }
    return () => {};
  }, [currentSiteId]);

  useEffect(() => {
    setCurrentSiteId(() => {
      return sites && Array.isArray(sites) && sites.length > 0
        ? Number(sites[0].id)
        : null;
    });
    return () => {
      setCurrentSiteId(null);
    };
  }, [sites]);

  const onSearchTypes = useCallback(
    e => {
      const { value } = e.target;
      setSearchTypeValue(value);
      if (value !== "") {
        const expandedIds = typeList
          .map((item: any) => {
            if (item.name.indexOf(value) > -1) {
              return getParentId(item.id, types);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        setExpandedTypeIds(expandedIds);
        if (expandedIds.length > 0) {
          setAutoExpandParent(true);
        } else {
          setAutoExpandParent(false);
        }
      } else {
        setExpandedTypeIds([]);
        setAutoExpandParent(false);
      }
    },
    [types]
  );

  const { formatMessage } = useIntl();

  const typesTreeData = useCallback(
    (data: any[], hasNode: boolean = true): any[] => {
      return data.map((item: any) => {
        const searchIndex = item.name.indexOf(searchTypeValue);
        const beforeStr = item.name.substr(0, searchIndex);
        const afterStr = item.name.substr(searchIndex + searchTypeValue.length);
        const searchTypeValueNode = (
          <>
            {beforeStr}
            <Typography.Text type="danger">{searchTypeValue}</Typography.Text>
            {afterStr}
          </>
        );
        return {
          title: hasNode ? (
            <div className="title d-flex align-items-center justify-content-space-between">
              <div className="name">
                {item.name.indexOf(searchTypeValue) !== -1
                  ? searchTypeValueNode
                  : item.name}
              </div>
              <Dropdown
                overlayStyle={{
                  minWidth: "80px"
                }}
                overlay={
                  <Menu>
                    <Menu.Item
                      onClick={e => {
                        e.domEvent.stopPropagation();
                        setActiveType({
                          parentId: item.id
                        });
                      }}
                    >
                      {formatMessage({ id: "action.add.subtype" })}
                    </Menu.Item>
                    <Menu.Item
                      onClick={e => {
                        e.domEvent.stopPropagation();
                        let params: any = {
                          id: item.id,
                          name: item.name
                        };
                        if (item.parentId) {
                          params["parentId"] = item.parentId;
                        }
                        if (item.source) {
                          params["source"] = item.source;
                        }
                        setActiveType(params);
                      }}
                    >
                      {formatMessage({ id: "action.edit" })}
                    </Menu.Item>
                    {/* <Menu.Item
                      onClick={e => {
                        e.domEvent.stopPropagation();
                        let params: any = {
                          id: item.id,
                          name: item.name
                        };
                        setActiveType(params);
                        setMoveType(true);
                      }}
                    >
                      {formatMessage({ id: "action.move" })}
                    </Menu.Item> */}
                    {item.source.deletable ? (
                      <>
                        <Menu.Divider />
                        <Menu.Item
                          danger
                          onClick={e => {
                            e.domEvent.stopPropagation();
                            Modal.confirm({
                              title: formatMessage({ id: "tips" }),
                              content: formatMessage({ id: "ask.delete.type" }),
                              onCancel: () => {},
                              onOk: () => {
                                typeServices
                                  .deleteType({
                                    // @ts-ignore
                                    id: aesEncrypt(
                                      item.id,
                                      initialState.keys.aes
                                    )
                                  })
                                  .then(() => {
                                    // 删除栏目成功后先清除本地的栏目缓存再重新获取
                                    if (window && window.sessionStorage) {
                                      window.sessionStorage.removeItem(
                                        // @ts-ignore
                                        SESSION_TYPES + "_" + currentSiteId
                                      );
                                    }
                                    getTypes();
                                  });
                              }
                            });
                          }}
                        >
                          {formatMessage({ id: "action.delete" })}
                        </Menu.Item>
                      </>
                    ) : null}
                  </Menu>
                }
              >
                <div onClick={e => e.stopPropagation()}>
                  <MoreOutlined />
                </div>
              </Dropdown>
            </div>
          ) : (
            item.name
          ),
          key: item.id,
          value: item.id,
          children: Array.isArray(item.children)
            ? typesTreeData(item.children, hasNode)
            : []
        };
      });
    },
    [searchTypeValue]
  );

  return (
    <>
      <Layout.Sider
        width={SIDE_W}
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          borderRight: "1px solid #eee"
        }}
      >
        <Layout
          style={{
            height: "100%",
            background: "#fafafa"
          }}
        >
          <Layout.Header
            style={{
              borderBottom: "1px solid #eee"
            }}
          >
            <div
              className="d-flex align-items-center"
              style={{ height: "100%" }}
            >
              <Input.Search
                placeholder={formatMessage({ id: "tips.search.types" })}
                disabled={loading.models.site || loading.models.type}
                onChange={onSearchTypes}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  minWidth: "38px",
                  marginLeft: "12px"
                }}
                onClick={() => {
                  setActiveType({});
                }}
              ></Button>
            </div>
          </Layout.Header>
          <Layout.Content
            style={{
              height: "100%",
              flex: "1 1 auto",
              overflow: "auto"
            }}
          >
            {!types ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  padding: "24px"
                }}
              >
                <LoadingOutlined />
              </div>
            ) : Array.isArray(types) && types.length > 0 ? (
              <Tree.DirectoryTree
                blockNode
                expandedKeys={expandedTypeIds}
                autoExpandParent={autoExpandParent}
                showIcon={false}
                multiple={false}
                defaultExpandAll={false}
                treeData={
                  types && Array.isArray(types) ? typesTreeData(types) : []
                }
                className={styles.types}
                onSelect={value => {
                  if (Array.isArray(value) && value.length > 0) {
                    let expandedIds: any[] = [];
                    const parentIds = (id: any) => {
                      const parentId = getParentId(id, types);
                      if (parentId) {
                        expandedIds.push(parentId);
                        parentIds(parentId);
                      }
                    };
                    parentIds(value[0]);
                    expandedIds.push(value[0]);
                    setExpandedTypeIds(expandedIds);
                    if (props.location.pathname !== `/content/${value[0]}`) {
                      history.push(`/content/${value[0]}`);
                    }
                  }
                }}
              ></Tree.DirectoryTree>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  padding: "24px"
                }}
              >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}
          </Layout.Content>
          <Layout.Footer
            style={{
              background: "#fff",
              padding: "16px 24px",
              borderTop: "1px solid #eee"
            }}
          >
            <Select
              placeholder={formatMessage({ id: "tips.select.site" })}
              value={currentSiteId ? currentSiteId : ""}
              style={{
                width: "100%"
              }}
              disabled={loading.models.site}
              options={
                sites && Array.isArray(sites)
                  ? sites.map(item => ({
                      label: item.name,
                      value: item.id
                    }))
                  : []
              }
              onChange={value => {
                setCurrentSiteId(Number(value));
              }}
            ></Select>
          </Layout.Footer>
        </Layout>
      </Layout.Sider>
      <Layout
        style={{
          marginLeft: SIDE_W,
          flex: "1 1 auto"
        }}
      >
        {props.children}
      </Layout>
      <Drawer
        title={
          activeType
            ? activeType?.id
              ? formatMessage({ id: "action.edit.type" })
              : activeType?.parentId
              ? formatMessage({ id: "action.add.subtype" })
              : formatMessage({ id: "action.add.type" })
            : formatMessage({ id: "tips" })
        }
        width="520px"
        visible={activeType !== null ? true : false}
        closable={true}
        maskClosable={true}
        keyboard={false}
        // cancelText={formatMessage({ id: "cancel" })}
        destroyOnClose={true}
        // confirmLoading={savingType}
        // okText={formatMessage({ id: "save" })}
        onClose={() => {
          setActiveType(null);
          setMoveType(false);
        }}
        // onOk={() => {
        //   if (typeModalFrom.current) {
        //     // @ts-ignore
        //     typeModalFrom.current.submit();
        //   }
        // }}
        footer={
          <div
            style={{
              textAlign: "right"
            }}
          >
            <Button
              onClick={() => {
                setActiveType(null);
                setMoveType(false);
              }}
              style={{ marginRight: 8 }}
            >
              关闭
            </Button>
            <Button
              onClick={() => {
                if (typeModalFrom.current) {
                  typeModalFrom.current.submit();
                }
              }}
              type="primary"
              loading={savingType}
            >
              保存
            </Button>
          </div>
        }
      >
        <Form ref={typeModalFrom} onFinish={saveType} layout="vertical">
          <Form.Item
            label="栏目名称"
            name="name"
            rules={[{ required: true }]}
            initialValue={
              activeType?.source?.name ? activeType?.source?.name : ""
            }
          >
            <Input size="large" disabled={savingType} />
          </Form.Item>
          <Form.Item
            label="栏目介绍"
            name="description"
            initialValue={
              activeType?.source?.description
                ? activeType?.source?.description
                : ""
            }
          >
            <Input.TextArea
              className="mooween-input-lg"
              autoSize={{ minRows: 2 }}
              disabled={savingType}
            />
          </Form.Item>
          <Form.Item
            label="栏目图片"
            name="image"
            initialValue={
              activeType?.source?.image ? activeType?.source?.image : ""
            }
          >
            <Extra
              options={{
                size: [1920, 500],
                type: "image"
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <span>栏目排序</span>
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
            name="sort"
            initialValue={
              activeType?.source?.sort ? activeType?.source?.sort : ""
            }
          >
            <InputNumber
              size="large"
              min={1}
              style={{ width: "100%" }}
              disabled={savingType}
            />
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="栏目内容缩略图宽"
                name="thumbWidth"
                initialValue={
                  activeType?.source?.thumbWidth
                    ? activeType?.source?.thumbWidth
                    : ""
                }
              >
                <InputNumber
                  size="large"
                  min={1}
                  style={{ width: "100%" }}
                  disabled={savingType}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="栏目内容缩略图高"
                name="thumbHeight"
                initialValue={
                  activeType?.source?.thumbHeight
                    ? activeType?.source?.thumbHeight
                    : ""
                }
              >
                <InputNumber
                  size="large"
                  min={1}
                  style={{ width: "100%" }}
                  disabled={savingType}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="SEO标题"
            name="seoTitle"
            initialValue={
              activeType?.source?.seoTitle ? activeType?.source?.seoTitle : ""
            }
          >
            <Input size="large" disabled={savingType} />
          </Form.Item>
          <Form.Item
            label={
              <>
                <span>SEO关键字</span>
                <Tooltip title="多个关键词以英文逗号分隔">
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
            name="seoKeywords"
            initialValue={
              activeType?.source?.seoKeywords
                ? activeType?.source?.seoKeywords
                : ""
            }
          >
            <Input.TextArea
              className="mooween-input-lg"
              autoSize={{ minRows: 2 }}
              disabled={savingType}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <span>SEO描述</span>
                <Tooltip title="合理的描述长度是155字符">
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
            name="seoDescription"
            initialValue={
              activeType?.source?.seoDescription
                ? activeType?.source?.seoDescription
                : ""
            }
          >
            <Input.TextArea
              className="mooween-input-lg"
              autoSize={{ minRows: 2 }}
              disabled={savingType}
            />
          </Form.Item>
          <Form.Item
            label="SVG图标"
            name="iconSvg"
            initialValue={
              activeType?.source?.iconSvg ? activeType?.source?.iconSvg : ""
            }
          >
            <Input.TextArea
              className="mooween-input-lg"
              autoSize={{ minRows: 2, maxRows: 5 }}
              disabled={savingType}
            />
          </Form.Item>
          <Form.Item
            label="跳转链接"
            name="redirect"
            initialValue={
              activeType?.source?.redirect ? activeType?.source?.redirect : ""
            }
          >
            <Input size="large" disabled={savingType} />
          </Form.Item>
          <Form.Item
            label="是否显示栏目"
            name="display"
            initialValue={activeType?.source?.display ? 1 : 0}
          >
            <Select
              size="large"
              style={{
                width: "100%"
              }}
            >
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={0}>否</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="父栏目"
            name="parentId"
            initialValue={activeType?.parentId ? activeType?.parentId : ""}
          >
            <TreeSelect
              showSearch
              size="large"
              style={{ width: "100%" }}
              treeData={
                types && Array.isArray(types) ? typesTreeData(types, false) : []
              }
            ></TreeSelect>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default withRouter(
  connect(({ type, site, loading }: any) => ({
    type,
    site,
    loading
  }))(Page)
);
