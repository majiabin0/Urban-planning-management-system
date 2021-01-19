import React, { useState, useRef, useCallback } from "react";
import { Layout, Avatar, Form, Input, Button, Spin } from "antd";
import { Helmet, useIntl, useModel } from "umi";
import * as services from "@/services/user";
import { aesEncrypt } from "@/utils";
import Header from "@/components/Header";
import Upload from "@/components/Upload";
import Icon from "@/components/Icon";
import styles from "./profile.less";

const Page: React.FC = () => {
  const formRef = useRef(null);

  const { initialState, refresh } = useModel("@@initialState");

  const [uploadAvatar, setUploadAvatar] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  const { formatMessage } = useIntl();

  const submit = useCallback(values => {
    setSaving(true);
    services
      .saveProfile({
        // @ts-ignore
        name: aesEncrypt(values.name, initialState?.keys.aes),
        // @ts-ignore
        avatar: aesEncrypt(values.avatar, initialState?.keys.aes)
      })
      .then(() => {
        setSaving(false);
        refresh();
      })
      .catch(() => {
        setSaving(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: "title.profile" })}</title>
      </Helmet>
      <Header title={formatMessage({ id: "title.profile" })} />
      <Layout.Content>
        <div
          style={{
            width: "80%",
            maxWidth: "260px",
            margin: "0 auto",
            padding: "24px 0"
          }}
        >
          <Form
            ref={formRef}
            className="hidden-label"
            layout="vertical"
            onFinish={submit}
          >
            <Form.Item
              label="头像"
              name="avatar"
              style={{
                textAlign: "center"
              }}
              rules={[{ required: true }]}
            >
              <Spin spinning={uploadAvatar}>
                <Upload
                  size="1M"
                  chunk
                  drop
                  disabled={uploadAvatar || saving}
                  accept={["image/jpeg", "image/png", "image/gif"]}
                  crop={{
                    aspect: 1
                  }}
                  multiple={false}
                  antd={{
                    showUploadList: false,
                    className: styles.avatar
                  }}
                  onStart={(file: any) => {
                    setUploadAvatar(true);
                    setAvatar(URL.createObjectURL(file));
                  }}
                  onCompleted={(res: any, file: any) => {
                    setUploadAvatar(false);
                    const { data } = res;
                    if (data.url) {
                      setAvatar(initialState?.cdn + data.url);
                      if (formRef.current) {
                        // @ts-ignore
                        formRef.current.setFieldsValue({
                          avatar: data.url
                        });
                      }
                    }
                  }}
                >
                  <Avatar size={64} icon={<Icon type="user" />} src={avatar} />
                </Upload>
              </Spin>
            </Form.Item>
            <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
              <Input placeholder="请填写姓名" size="large" disabled={saving} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={saving}
                block
              >
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout.Content>
    </>
  );
};

export default Page;
