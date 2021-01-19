import React, { useState, useRef, useEffect } from "react";
import { useIntl, Helmet, connect, useModel, withRouter, history } from "umi";
import {
  Layout,
  Empty,
  Input,
  Button,
  Table,
  Space,
  Typography,
  Popconfirm,
  Spin,
  Tooltip,
  message,
      Tabs
} from "antd";
const { TabPane } = Tabs;
import { SingleUserType, FormValues } from "./data.d";
import moment from "moment";
import {
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SettingOutlined
} from "@ant-design/icons";
import Header from "@/components/Header";
import { aesEncrypt } from "@/utils";
import styles from "./styles.less";
import UserModal from "./components/UserModal";
import RoleModal from "./components/roleModal";
// import Loading from '@/components/Loading';
import * as services from "@/services/member";

const Page: React.FC<{
  member: any;
  loading: any;
  dispatch: any;
  location: any;
}> = ({ member, dispatch, loading, location }) => {
  const { initialState } = useModel("@@initialState");

  const { formatMessage } = useIntl();

  const [modalVisible, setModalVisible] = useState(false);
    const [roleVisible, setRoleVisible] = useState(false);
  const [record, setRecord] = useState<any>(undefined);
  // const [siteId, setSiteId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [initState, setInitState] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getSites = () => {
    dispatch({
      type: "member/searchAdmin",
      payload: {
        // // @ts-ignore
        // articleTypeId: aesEncrypt(typeId, initialState?.keys.aes),
        page: aesEncrypt(String(page), String(initialState?.keys?.aes)),
        pageSize: aesEncrypt(String(pageSize), String(initialState?.keys?.aes))
      }
    });
  };
    const getRole = () => {
        dispatch({
            type: "member/getRole",
            payload: {
                // // @ts-ignore
                // articleTypeId: aesEncrypt(typeId, initialState?.keys.aes),
                page: aesEncrypt(String(page), String(initialState?.keys?.aes)),
                pageSize: aesEncrypt(String(pageSize), String(initialState?.keys?.aes))
            }
        });
    };
  function callback(key) {
    console.log(key);
  }
  const editHandler = (record: any) => {
    setModalVisible(true);
    setRecord(record);
  };
    const editHandler2 = (record: any) => {
        setRoleVisible(true);
        setRecord(record);
    };
    const closeHandler = () => {
        setModalVisible(false);
    };
  const closeHandler2 = () => {
    setRoleVisible(false);
  };

  const onFinish = async (values: FormValues) => {
    setConfirmLoading(true);
    console.log(values, "values");
    let id = 0;

    if (record) {
      id = record.id;
    }

    let serviceFun;
    if (id) {
        serviceFun = services.adminUpdate;
    } else {
        serviceFun = services.addAdmin;
    }
    //
    let data = {};
    data = values;
    data = {
      id: aesEncrypt(String(id), String(initialState?.keys?.aes)),
      name: aesEncrypt(values.name, String(initialState?.keys?.aes)),
      username: aesEncrypt(values.username, String(initialState?.keys?.aes)),
      roleId: aesEncrypt(values.roleId, String(initialState?.keys?.aes)),
      avatar: aesEncrypt(values.avatar, String(initialState?.keys?.aes)),
    };
    if (id) {
      var result = await serviceFun({ id, data });
    } else {
      var result = await serviceFun({  data });
    }

    if (result) {
      setModalVisible(false);
      message.success("成功");
      getSites();
    }
    setConfirmLoading(false);
  };
    const onFinish2 = async (values: FormValues) => {
        setConfirmLoading(true);
        console.log(record, "record");
        let id = 0;

        if (record) {
            id = record.id;
        }

        let serviceFun;
        if (id) {
            serviceFun = services.roleUpdate;
        } else {
            serviceFun = services.addRole;
        }
        //
        let data = {};
        data = values;
        values.actions=[{
            name:"邮件营销"
        }];
        values.types=[{
            name:"邮件营销"
        }];
        values.menus=[{
            name:"邮件营销"
        }];
        console.log(values, "values");
        data = {
            menus: aesEncrypt(String(id), String(initialState?.keys?.aes)),
            name: aesEncrypt(values.name, String(initialState?.keys?.aes)),
            actions: aesEncrypt(values.userName, String(initialState?.keys?.aes)),
            institute: aesEncrypt(values.roleId, String(initialState?.keys?.aes)),
            types: aesEncrypt(values.avatar, String(initialState?.keys?.aes)),
        };
        if (id) {
            var result = await serviceFun({ id, data });
        } else {
            var result = await serviceFun({  data });
        }

        if (result) {
            setRoleVisible(false);
            message.success("成功");
            getSites();
        }
        setConfirmLoading(false);
    };
  useEffect(() => {
    getSites();
      getRole();
  }, []);

  useEffect(() => {
    if (initState) {
      setInitState(false);
    } else {
      getSites();
    }
      console.log(member, "member");
  }, [page]);

  // useEffect(() => {
  //     if (type.typeDetail && type.typeDetail.siteId) {
  //         setSiteId(type.typeDetail.siteId)
  //     }
  //     return () => {
  //         setSiteId(null)
  //     }
  // }, [type.typeDetail])

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: "title.settings" })}</title>
      </Helmet>
      <Header
        title={formatMessage({ id: "title.settings" })}
        style={{
          borderBottom: "1px solid #eee"
        }}
      ></Header>
      <Layout.Content
        style={{
          position: "relative"
        }}
      >
        <UserModal
          visible={modalVisible}
          closeHandler={closeHandler}
          record={record}
          onFinish={onFinish}
          confirmLoading={confirmLoading}
        ></UserModal>
          <RoleModal
              visible={roleVisible}
              closeHandler={closeHandler2}
              record={record}
              onFinish={onFinish2}
              confirmLoading={confirmLoading}
          ></RoleModal>
        <div>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Tab 1" key="1">
              <div>
                <Button
                    type="primary"
                    style={{
                        marginBottom:20,
                        marginRight:30,
                        float:"right"

                    }}
                    // disabled={!typeId || !siteId}
                    onClick={() => {
                      editHandler(record);
                    }}
                >{formatMessage({id: 'action.add.acticle'})}</Button>
              </div>
              <Table
                  pagination={{
                    pageSize: pageSize,
                    total: member.list && member.list.total ? member.list.total : 0,
                    onChange: value => {
                      setPage(value);
                    }
                  }}
                  bordered
                  loading={loading.models.member}
                  scroll={{ x: 1000 }}
                  className={styles.table}
                  columns={[
                    {
                      title: <div style={{ whiteSpace: "nowrap" }}>编号</div>,
                      dataIndex: "id",
                      key: "id",
                      align: "center",
                      fixed: "left",
                      width: 100
                    },
                    {
                      title: <div style={{ whiteSpace: "nowrap" }}>成员名称</div>,
                      dataIndex: "name",
                      key: "name",
                      render: val => (
                          <div
                              style={{ wordWrap: "break-word", wordBreak: "break-word" }}
                          >
                            {val}
                          </div>
                      )
                    },
                    {
                      title: <div style={{ whiteSpace: "nowrap" }}>用户名称</div>,
                      dataIndex: "username",
                      key: "username",
                      render: val => (
                          <Typography.Text style={{ width: "100%" }} ellipsis>
                            {val}
                          </Typography.Text>
                      )
                    },
                    {
                      title: <div style={{ whiteSpace: "nowrap" }}>创建时间</div>,
                      dataIndex: "createTime",
                      key: "createTime",
                      width: 200,
                      render: item => <Typography.Text ellipsis>{moment(item).format('YYYY-MM-DD')}</Typography.Text>
                    },
                    {
                      title: <div style={{ whiteSpace: "nowrap" }}>更新时间</div>,
                      dataIndex: "updateTime",
                      key: "updateTime",
                      render: item => <Typography.Text ellipsis>{moment(item).format('YYYY-MM-DD')}</Typography.Text>
                    },
                    {
                      title: <div style={{ whiteSpace: "nowrap" }}>角色ID</div>,
                      dataIndex: "roleId",
                      key: "roleId",
                      render: val => (
                          <div
                              style={{ wordWrap: "break-word", wordBreak: "break-word" }}
                          >
                            {val}
                          </div>
                      )
                    },
                    {
                      title: '图片',
                      dataIndex: 'avatar',
                      key: 'avatar',
                      render: (record) => <img src={initialState?.cdn + record} />//这里放后台返回的图片的路径或者整个<img/>
                    },
                    {
                      title: <div style={{ whiteSpace: "nowrap" }}>操作</div>,
                      dataIndex: "action",
                      key: "action",
                      fixed: "right",
                      align: "center",
                      width: 120,
                      render: (item, record) => (
                          <>
                            <Space size="middle">
                              <a
                                  onClick={() => {
                                      console.log(member, "member");
                                    editHandler(record);
                                  }}
                              >
                                <a><Typography.Text  ellipsis>编辑</Typography.Text></a>
                              </a>
                              <Popconfirm
                                  placement="topRight"
                                  title="确定删除这篇内容吗？"
                                  okText="确定"
                                  okType="danger"
                                  cancelText="取消"
                                  onConfirm={() => {
                                    services.deleteMember({
                                      // @ts-ignore
                                      id: aesEncrypt(record.id, initialState?.keys.aes)
                                    }).then(() => {
                                        getSites()
                                    })
                                  }}
                              >
                                <a><Typography.Text type="danger" ellipsis>删除</Typography.Text></a>
                              </Popconfirm>
                            </Space>
                          </>

                      )
                    }
                  ]}
                  dataSource={
                    member.list && member.list.rows
                        ? member.list.rows.map((item: any) => ({
                          key: item.id,
                          ...item
                        }))
                        : []
                  }
                  sticky
              />
            </TabPane>
            <TabPane tab="Tab 2" key="2">
              <div>
                <Button
                    type="primary"
                    style={{
                        marginBottom:20,
                        marginRight:30,
                        float:"right"

                    }}
                    // disabled={!typeId || !siteId}
                    onClick={() => {
                      editHandler2(record);
                    }}
                >{formatMessage({id: 'action.add.acticle'})}</Button>
              </div>
              <Table
                  pagination={{
                    pageSize: pageSize,
                    total: member.role && member.role.total ? member.role.total : 0,
                    onChange: value => {
                      setPage(value);
                    }
                  }}
                  bordered
                  loading={loading.models.member}
                  scroll={{x: 1000}}
                  className={styles.table}
                  columns={[
                    {
                      title: <div style={{whiteSpace: "nowrap"}}>编号</div>,
                      dataIndex: "id",
                      key: "id",
                      align: "center",
                      fixed: "left",
                      width: 100
                    },
                    {
                      title: <div style={{whiteSpace: "nowrap"}}>名称</div>,
                      dataIndex: "name",
                      key: "name",
                      render: val => (
                          <div
                              style={{wordWrap: "break-word", wordBreak: "break-word"}}
                          >
                            {val}
                          </div>
                      )
                    },
                      {
                          title: <div style={{whiteSpace: "nowrap"}}>菜单</div>,
                          dataIndex: "menus",
                          key: "menus",
                          render: val => (
                              <div
                                  style={{wordWrap: "break-word", wordBreak: "break-word"}}
                              >
                                  {val}
                              </div>
                          )
                      },
                      {
                          title: <div style={{whiteSpace: "nowrap"}}>类型</div>,
                          dataIndex: "types",
                          key: "types",
                          render: val => (
                              <div
                                  style={{wordWrap: "break-word", wordBreak: "break-word"}}
                              >
                                  {val}
                              </div>
                          )
                      },
                      {
                          title: <div style={{whiteSpace: "nowrap"}}>动作</div>,
                          dataIndex: "actions",
                          key: "actions",
                          render: val => (
                              <div
                                  style={{wordWrap: "break-word", wordBreak: "break-word"}}
                              >
                                  {val}
                              </div>
                          )
                      },
                    {
                      title: <div style={{whiteSpace: "nowrap"}}>创建时间</div>,
                      dataIndex: "createTime",
                      key: "createTime",
                      width: 200,
                      render: item => <Typography.Text ellipsis>{moment(item).format('YYYY-MM-DD')}</Typography.Text>
                    },
                    {
                      title: <div style={{whiteSpace: "nowrap"}}>更新时间</div>,
                      dataIndex: "updateTime",
                      key: "updateTime",
                      render: item => <Typography.Text ellipsis>{moment(item).format('YYYY-MM-DD')}</Typography.Text>
                    },
                    {
                      title: <div style={{whiteSpace: "nowrap"}}>操作</div>,
                      dataIndex: "action",
                      key: "action",
                      fixed: "right",
                      align: "center",
                      width: 140,
                      render: (item, record) => (
                          <>
                            <Space size="middle">

                                <Button
                                    type="text"
                                    size="small"
                                    name='编辑'
                                    icon={<SettingOutlined />}
                                    onClick={() => {
                                        editHandler2(record);
                                    }}
                                />
                                    {/*<a><Typography.Text ellipsis>编辑</Typography.Text></a>*/}
                              <Popconfirm
                                  placement="topRight"
                                  title="确定删除这篇内容吗？"
                                  okText="确定"
                                  okType="danger"
                                  cancelText="取消"
                                  onConfirm={() => {
                                    services.deleteRole({
                                      // @ts-ignore
                                      id: aesEncrypt(record.id, initialState?.keys.aes)
                                    }).then(() => {
                                      getSites()
                                    })
                                  }}
                              >
                                <a><Typography.Text type="danger" ellipsis>删除</Typography.Text></a>
                              </Popconfirm>
                            </Space>
                          </>

                      )
                    }
                  ]}
                  dataSource={
                    member.role && member.role.rows
                        ? member.role.rows.map((item: any) => ({
                          key: item.id,
                          ...item
                        }))
                        : []
                  }
                  sticky
              />
            </TabPane>
          </Tabs>
        </div>
      </Layout.Content>
    </>
  );
};

export default withRouter(
  connect(({ member, loading }: any) => ({
    member,
    loading
  }))(Page)
);
