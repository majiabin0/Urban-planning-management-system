import React, { useState, useEffect, useCallback, useRef } from "react";
import { StickyContainer, Sticky } from "react-sticky";
import { useIntl, useModel, Helmet, connect, withRouter } from "umi";
import {
  Layout,
  Tabs,
  Table,
  Form,
  Typography,
  Drawer,
  Space,
  Button,
  message
} from "antd";
import Header from "@/components/Header";
import { aesEncrypt } from "@/utils";
import styles from "./styles.less";
import Extra from "@/components/Extra";
import ExtraArray from "@/components/ExtraArray";
import * as services from "@/services/plugin";

const Page: React.FC<{
  plugin: any;
  site: any;
  loading: any;
  dispatch: any;
}> = ({ plugin, site, loading, dispatch }) => {
  const { initialState } = useModel("@@initialState");

  const { formatMessage } = useIntl();

  const formRef: any = useRef(null);

  const { sites } = site;
  const { list } = plugin;

  const [initState, setInitState] = useState(true);
  const [currentSiteId, setCurrentSiteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [editPlugin, setEditPlugin] = useState<any>(null);
  const [pluginInitialValue, setPluginInitialValue] = useState<any>(null);
  const [saving, setSaving] = useState<Boolean>(false);

  const getPlugins = useCallback(() => {
    dispatch({
      type: "plugin/searchPlugins",
      payload: {
        siteId: aesEncrypt(
          String(currentSiteId),
          String(initialState?.keys?.aes)
        ),
        page: aesEncrypt(String(page), String(initialState?.keys?.aes)),
        pageSize: aesEncrypt(String(pageSize), String(initialState?.keys?.aes))
      }
    });
  }, [currentSiteId, page, pageSize]);

  const closeDrawer = useCallback(() => {
    setEditPlugin(null);
  }, []);

  const save = async (values: any) => {
    setSaving(true);
    const id = aesEncrypt(
      String(editPlugin.id),
      String(initialState?.keys?.aes)
    );
    const data = {
      siteId: aesEncrypt(
        String(editPlugin.siteId),
        String(initialState?.keys?.aes)
      ),
      name: aesEncrypt(editPlugin.name, String(initialState?.keys?.aes)),
      values: aesEncrypt(
        values.default
          ? typeof values.default === "object"
            ? JSON.stringify(values.default)
            : String(values.default)
          : JSON.stringify(values),
        String(initialState?.keys?.aes)
      )
    };
    const result = await services.pluginUpdate({ id, data });
    if (result) {
      setSaving(false);
      message.success("修改成功");
      setEditPlugin(null);
      getPlugins();
    }
    setSaving(false);
  };

  useEffect(() => {
    if (editPlugin) {
      if (
        editPlugin.options &&
        typeof JSON.parse(editPlugin.options) === "object"
      ) {
        const options = JSON.parse(editPlugin.options);
        if (
          editPlugin.values &&
          typeof JSON.parse(editPlugin.values) === "object"
        ) {
          const values = JSON.parse(editPlugin.values);
          let initialValue: any = {};
          options.forEach((item: any) => {
            if (item.field === "default") {
              initialValue[item.field] = values;
            } else {
              initialValue[item.field] = values[item.field];
            }
          });
          setPluginInitialValue(initialValue);
        }
      }
    }
    return () => {
      setPluginInitialValue(null);
    };
  }, [editPlugin]);

  useEffect(() => {
    if (pluginInitialValue) {
      if (formRef && formRef.current) {
        formRef.current.setFieldsValue(pluginInitialValue);
      }
    }
    return () => {};
  }, [pluginInitialValue]);

  useEffect(() => {
    dispatch({
      type: "site/getSites"
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (Array.isArray(sites) && sites.length > 0) {
      setCurrentSiteId(sites[0].id);
    }
    return () => {
      setCurrentSiteId(null);
    };
  }, [sites]);

  useEffect(() => {
    if (currentSiteId) {
      getPlugins();
    }
    return () => {};
  }, [currentSiteId]);

  useEffect(() => {
    if (initState) {
      setInitState(false);
    } else {
      getPlugins();
    }
  }, [page]);

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: "title.plugin" })}</title>
      </Helmet>
      <Header title={formatMessage({ id: "title.plugin" })} />
      <Layout.Content>
        <StickyContainer>
          <Tabs
            activeKey={currentSiteId ? String(currentSiteId) : ""}
            size="large"
            renderTabBar={(props, DefaultTabBar) => (
              <Sticky
                // @ts-ignore
                topOffset={0 - LAYOUT_HEADER_HEIGHT}
              >
                {({ style }: any) => (
                  <DefaultTabBar
                    {...props}
                    className={styles.tabbar}
                    style={{
                      ...style,
                      // @ts-ignore
                      top: `${LAYOUT_HEADER_HEIGHT + style.top}px`
                    }}
                  />
                )}
              </Sticky>
            )}
            onChange={vlaue => {
              setCurrentSiteId(Number(vlaue));
            }}
          >
            {Array.isArray(sites) &&
              sites.map((item: any) => {
                return (
                  <Tabs.TabPane tab={item.name} key={item.id}>
                    <Table
                      className={styles.table}
                      pagination={{
                        pageSize: pageSize,
                        total: list && list.total ? list.total : 0,
                        onChange: value => {
                          setPage(value);
                        }
                      }}
                      bordered
                      loading={loading.models.plugin}
                      scroll={{ x: 600 }}
                      columns={[
                        {
                          title: (
                            <div style={{ whiteSpace: "nowrap" }}>编号</div>
                          ),
                          dataIndex: "id",
                          key: "id",
                          align: "center",
                          fixed: "left",
                          width: 100
                        },
                        {
                          title: (
                            <div style={{ whiteSpace: "nowrap" }}>插件名称</div>
                          ),
                          dataIndex: "name",
                          key: "name",
                          render: val => (
                            <div
                              style={{
                                wordWrap: "break-word",
                                wordBreak: "break-word"
                              }}
                            >
                              {val}
                            </div>
                          )
                        },
                        {
                          title: (
                            <div style={{ whiteSpace: "nowrap" }}>操作</div>
                          ),
                          dataIndex: "action",
                          key: "action",
                          fixed: "right",
                          align: "center",
                          width: 180,
                          render: (item, record) => (
                            <>
                              <Space size="middle">
                                <Button
                                  size="small"
                                  type="primary"
                                  onClick={() => {
                                    setEditPlugin(record);
                                  }}
                                >
                                  编辑插件内容
                                </Button>
                              </Space>
                            </>
                          )
                        }
                      ]}
                      dataSource={
                        list && list.rows
                          ? list.rows.map((item: any) => ({
                              key: item.id,
                              ...item
                            }))
                          : []
                      }
                      sticky
                    />
                  </Tabs.TabPane>
                );
              })}
          </Tabs>
        </StickyContainer>
      </Layout.Content>
      <Drawer
        title={
          editPlugin && editPlugin.name
            ? `编辑${editPlugin.name}`
            : "编辑插件内容"
        }
        width="580px"
        onClose={closeDrawer}
        visible={editPlugin !== null}
        footer={
          <div
            style={{
              textAlign: "right"
            }}
          >
            <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
              关闭
            </Button>
            <Button
              onClick={() => {
                if (formRef.current) {
                  formRef.current.submit();
                }
              }}
              type="primary"
              loading={Boolean(saving)}
            >
              保存
            </Button>
          </div>
        }
      >
        {editPlugin &&
        editPlugin.options &&
        typeof JSON.parse(editPlugin.options) === "object" ? (
          <Form layout="vertical" onFinish={save} ref={formRef}>
            {JSON.parse(editPlugin.options).map((item: any, key: any) => {
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
            })}
          </Form>
        ) : null}
      </Drawer>
    </>
  );
};

export default withRouter(
  connect(({ plugin, site, loading }: any) => ({
    plugin,
    site,
    loading
  }))(Page)
);
