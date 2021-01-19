import React, { useState, useRef, useEffect } from "react";
import { useIntl, Helmet, connect, useModel, withRouter, history } from "umi";
import { Layout, Empty, Input, Button, Table, Space, Typography, Popconfirm, Spin, Tooltip } from "antd";
import moment from 'moment'
import {
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import Header from "@/components/Header";
import { aesEncrypt } from '@/utils'
import styles from './styles.less'
import Loading from '@/components/Loading';
import * as services from '@/services/article'

const Page: React.FC<{
  type: any;
  article: any;
  loading: any;
  dispatch: any;
  location: any;
}> = ({article, type, loading, dispatch, location}) => {
  const { initialState } = useModel('@@initialState')

  const { formatMessage } = useIntl();

  const searchInput = useRef(null)

  const [showSearch, setShowSearch] = useState(false)
  const [typeId, setTypeId] = useState(null)
  const [siteId, setSiteId] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [initState, setInitState] = useState(true)

  const getArticles = () => {
    dispatch({
      type: 'article/getArticles',
      payload: {
        // @ts-ignore
        articleTypeId: aesEncrypt(typeId, initialState?.keys.aes),
        // @ts-ignore
        page: aesEncrypt(String(page), initialState?.keys.aes),
        // @ts-ignore
        pageSize: aesEncrypt(String(pageSize), initialState?.keys.aes),
      }
    })
  }

  useEffect(() => {
    if (initState) {
      setInitState(false)
    } else {
      getArticles()
    }
  }, [page]);

  useEffect(() => {
    const match = location.pathname.match(/\d+/g)
    if (match && match.length > 0) {
      setTypeId(match[0])
    }
    return () => {}
  }, [location.pathname]);

  useEffect(() => {
    if (type.typeDetail && type.typeDetail.siteId) {
      setSiteId(type.typeDetail.siteId)
    }
    return () => {
      setSiteId(null)
    }
  }, [type.typeDetail])

  useEffect(() => {
    if (typeId) {
      dispatch({
        type: 'type/getDetail',
        payload: {
          // @ts-ignore
          id: aesEncrypt(typeId, initialState?.keys.aes)
        }
      })
      getArticles()
    }
    return () => {}
  }, [typeId])

  useEffect(() => {
    if (showSearch) {
      if (searchInput.current) {
        // @ts-ignore
        searchInput.current.input.focus()
      }
    }
    return () => {}
  }, [showSearch])

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: "title.content" })}</title>
      </Helmet>
      <Header 
        style={{
          borderBottom: '1px solid #eee'
        }}
        actions={
          <>
          {
            showSearch ? null : (
              <Button 
                shape="circle" 
                icon={<SearchOutlined />} 
                onClick={() => {
                  setShowSearch(true)
                }}
              />
            )
          }
          </>
        }
      >
        {
          showSearch ? 
            <Input 
              ref={searchInput}
              placeholder={formatMessage({id: 'tips.search.article'})} 
              size="large" 
              style={{
                width: "100%",
                border: 0,
                paddingLeft: 0,
                boxShadow: 'none'
              }}
            /> : null
        }
      </Header>
      <Spin 
        spinning={loading.models.article || loading.models.type}
      >
        <Layout.Content
          style={{
            position: 'relative',
            height: '100%',
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className={styles.listHeader}>
            <h3>{type.typeDetail && type.typeDetail.name ? type.typeDetail.name : ''}</h3>
            <div>
              <Button 
                type="primary"
                disabled={!typeId || !siteId}
                onClick={() => {
                  history.push(`/article/editor?typeId=${typeId}&siteId=${siteId}`);
                }}
              >{formatMessage({id: 'action.add.acticle'})}</Button>
            </div>
          </div>
          <Table
            pagination={{
              pageSize: pageSize,
              total: article.list && article.list.total ? article.list.total : 0,
              onChange: (value) => {
                setPage(value)
              }
            }}
            bordered
            rowSelection={{
              type: 'checkbox',
              columnWidth: 50,
              fixed: true
            }}    
            className={styles.table}
            // loading={loading.models.article}
            columns={[{
              title: <div style={{ whiteSpace: 'nowrap' }}>编号</div>,
              dataIndex: 'id',
              key: 'id',
              align: 'center',
              width: '100px',
            }, {
              title: <div style={{ whiteSpace: 'nowrap' }}>标题</div>,
              dataIndex: 'title',
              key: 'title',
              render: val => <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{val}</div>

            }, {
              title: <div style={{ whiteSpace: 'nowrap' }}>栏目</div>,
              dataIndex: 'type',
              key: 'type',
              width: '180px',
              render: item => <Typography.Text ellipsis>{item.name}</Typography.Text>
            }, {
              title: <div style={{ whiteSpace: 'nowrap' }}>添加时间</div>,
              dataIndex: 'createTime',
              key: 'createTime',
              width: '130px',
              render: item => <Typography.Text ellipsis>{moment(item).format('YYYY-MM-DD')}</Typography.Text>
            }, {
              title: <div style={{ whiteSpace: 'nowrap' }}>预览</div>,
              dataIndex: 'preview',
              key: 'preview',
              align: 'center',
              width: '60px',
              render: (item, record) => {
                return <>{
                  record.previewUrl ? (
                    <Tooltip title="点击预览">
                      <EyeOutlined style={{
                        cursor: 'pointer'
                      }} onClick={() => {
                        window.open(record.previewUrl, "_blank")
                      }}/>
                    </Tooltip>
                  ) : <Tooltip title="不支持预览"><EyeInvisibleOutlined style={{opacity: .75}} /></Tooltip>
                }</>
              }
            }, {
              title:  <div style={{ whiteSpace: 'nowrap' }}>操作</div>,
              dataIndex: 'action',
              key: 'action',
              fixed: 'right',
              width: '160px',
              render: (item, record) => (<>
                <Space size="middle">
                  {
                    record.status === 1 ? (
                      <Popconfirm
                        title="确定撤回已发布的内容吗？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                          services.unPublishArticle({
                            // @ts-ignore
                            id: aesEncrypt(record.id, initialState?.keys.aes)
                          }).then(() => {
                            getArticles()
                          })
                        }}
                      >
                        <a><Typography.Text ellipsis>撤回</Typography.Text></a>
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title="确定发布这篇内容吗？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                          services.publishArticle({
                            // @ts-ignore
                            id: aesEncrypt(record.id, initialState?.keys.aes)
                          }).then(() => {
                            getArticles()
                          })
                        }}
                      >
                        <a><Typography.Text type="success" ellipsis>发布</Typography.Text></a>
                      </Popconfirm>
                    )
                  }
                  <a onClick={() => {
                    history.push(`/article/editor?id=${record.id}&typeId=${typeId}&siteId=${siteId}`);
                  }}><Typography.Text ellipsis>编辑</Typography.Text></a>
                  <Popconfirm
                    placement="topRight"
                    title="确定删除这篇内容吗？"
                    okText="确定"
                    okType="danger"
                    cancelText="取消"
                    onConfirm={() => {
                      services.deleteArticle({
                        // @ts-ignore
                        id: aesEncrypt(record.id, initialState?.keys.aes)
                      }).then(() => {
                        getArticles()
                      })
                    }}
                  >
                    <a><Typography.Text type="danger" ellipsis>删除</Typography.Text></a>
                  </Popconfirm>
                </Space>
              </>)
            }]}
            dataSource={article.list && article.list.rows ? article.list.rows.map((item:any) => ({
              key: item.id,
              ...item
            })) : []}
            scroll={{ x: 1000 }} 
            sticky
          />
        </Layout.Content>
      </Spin>
    </>
  );
};

export default withRouter(
  connect(({ type, article, loading }: any) => ({
    type,
    article,
    loading
  }))(Page)
);
