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
  message
} from "antd";
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
// import Loading from '@/components/Loading';
import * as services from "@/services/site";

const Page: React.FC<{
  site: any;
  loading: any;
  dispatch: any;
  location: any;
}> = ({ site, dispatch, loading, location }) => {
  const { initialState } = useModel("@@initialState");

  const { formatMessage } = useIntl();

  const [modalVisible, setModalVisible] = useState(false);
  const [record, setRecord] = useState<any>(undefined);
  // const [siteId, setSiteId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [initState, setInitState] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getSites = () => {
    dispatch({
      type: "site/searchSites",
      payload: {
        // // @ts-ignore
        // articleTypeId: aesEncrypt(typeId, initialState?.keys.aes),
        page: aesEncrypt(String(page), String(initialState?.keys?.aes)),
        pageSize: aesEncrypt(String(pageSize), String(initialState?.keys?.aes))
      }
    });
  };

  const editHandler = (record: any) => {
    setModalVisible(true);
    setRecord(record);
  };

  const closeHandler = () => {
    setModalVisible(false);
  };

  const onFinish = async (values: FormValues) => {
    setConfirmLoading(true);
    // console.log(values, "values");
    let id = 0;

    if (record) {
      id = record?.id;
    }

    // let serviceFun;
    // if (id) {
    //     serviceFun = editRecord;
    // } else {
    //     serviceFun = addRecord;
    // }
    //
    let data = {};
    data = values;
    data = {
      id: aesEncrypt(String(id), String(initialState?.keys?.aes)),
      name: aesEncrypt(values.name, String(initialState?.keys?.aes)),
      template: aesEncrypt(values.template, String(initialState?.keys?.aes)),
      icpNo: aesEncrypt(values.icpNo, String(initialState?.keys?.aes)),
      seoTitle: aesEncrypt(values.seoTitle, String(initialState?.keys?.aes)),
      seoDescription: aesEncrypt(
        values.seoDescription,
        String(initialState?.keys?.aes)
      ),
      seoKeywords: aesEncrypt(
        values.seoKeywords,
        String(initialState?.keys?.aes)
      ),
      email: aesEncrypt(values.email, String(initialState?.keys?.aes))
    };
    const result = await services.siteUpdate({ id, data });
    if (result) {
      setModalVisible(false);
      message.success("配置成功");
      getSites();
    }
    setConfirmLoading(false);
  };

  useEffect(() => {
    getSites();
  }, []);

  useEffect(() => {
    // console.log(site, "site");
    if (initState) {
      setInitState(false);
    } else {
      getSites();
    }
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
        <Table
          pagination={{
            pageSize: pageSize,
            total: site.list && site.list.total ? site.list.total : 0,
            onChange: value => {
              setPage(value);
            }
          }}
          bordered
          loading={loading.models.site}
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
              title: <div style={{ whiteSpace: "nowrap" }}>站点名称</div>,
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
              title: <div style={{ whiteSpace: "nowrap" }}>模板文件夹</div>,
              dataIndex: "template",
              key: "template",
              render: val => (
                <Typography.Text style={{ width: "100%" }} ellipsis>
                  {val}
                </Typography.Text>
              )
            },
            {
              title: <div style={{ whiteSpace: "nowrap" }}>ICP备案号</div>,
              dataIndex: "icpNo",
              key: "icpNo",
              width: 200,
              render: val => (
                <Typography.Text style={{ width: "100%" }} ellipsis>
                  {val}
                </Typography.Text>
              )
            },
            {
              title: <div style={{ whiteSpace: "nowrap" }}>SEO标题</div>,
              dataIndex: "seoTitle",
              key: "seoTitle",
              render: val => (
                <div
                  style={{ wordWrap: "break-word", wordBreak: "break-word" }}
                >
                  {val}
                </div>
              )
            },
            {
              title: <div style={{ whiteSpace: "nowrap" }}>SEO关键字</div>,
              dataIndex: "seoKeywords",
              key: "seoKeywords",
              render: val => (
                <div
                  style={{ wordWrap: "break-word", wordBreak: "break-word" }}
                >
                  {val}
                </div>
              )
            },
            {
              title: <div style={{ whiteSpace: "nowrap" }}>SEO描述</div>,
              dataIndex: "seoDescription",
              key: "seoDescription",
              render: val => (
                <div
                  style={{ wordWrap: "break-word", wordBreak: "break-word" }}
                >
                  {val}
                </div>
              )
            },
            {
              title: <div style={{ whiteSpace: "nowrap" }}>操作</div>,
              dataIndex: "action",
              key: "action",
              fixed: "right",
              align: "center",
              width: 80,
              render: (item, record) => (
                <>
                  <Space size="middle">
                    <Button
                      type="text"
                      size="small"
                      icon={<SettingOutlined />}
                      onClick={() => {
                        editHandler(record);
                      }}
                    />
                  </Space>
                </>
              )
            }
          ]}
          dataSource={
            site.list && site.list.rows
              ? site.list.rows.map((item: any) => ({
                  key: item.id,
                  ...item
                }))
              : []
          }
          sticky
        />
      </Layout.Content>
    </>
  );
};

export default withRouter(
  connect(({ site, loading }: any) => ({
    site,
    loading
  }))(Page)
);
