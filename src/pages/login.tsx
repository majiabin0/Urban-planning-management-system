import Cookies from "js-cookie";
import React, { useState } from "react";
import { Form, Input, Button, Tooltip } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  BulbFilled,
  LoadingOutlined
} from "@ant-design/icons";
// @ts-ignore
import { Helmet, useIntl, useModel, connect, history } from "umi";
import Logo from "@/components/Logo";
import * as services from "@/services/auth";
import styles from "./login.less";
import { aesEncrypt } from "@/utils";

const Page: React.FC<{
  dispatch: any;
  auth: any;
}> = ({ dispatch, auth }) => {
  // @ts-ignore
  const { initialState, refresh } = useModel("@@initialState");
  const [fields, setFields] = useState([]);
  const [submiting, setSubmiting] = useState(false);
  const { formatMessage } = useIntl();

  const { captcha } = auth;

  const refreshCaptcha = () => {
    dispatch({
      type: "auth/getCaptcha"
    });
  };

  const handleFormFinish = (values: any) => {
    setSubmiting(true);
    services
      .signin({
        // @ts-ignore
        username: aesEncrypt(values.username, initialState.keys.aes),
        // @ts-ignore
        password: aesEncrypt(values.password, initialState.keys.aes),
        // @ts-ignore
        code: aesEncrypt(values.code, initialState.keys.aes)
      })
      .then(res => {
        setSubmiting(false);
        const { token, expired_in } = res.data;
        if (token && expired_in) {
          // @ts-ignore
          Cookies.set(COOKIE_TOKEN, token, {
            expires: expired_in / 60 / 60 / 24
          });
          refresh();
          // let targetPath: string | null = "/";
          // if (window && window.sessionStorage) {
          //   // @ts-ignore
          //   targetPath = window.sessionStorage.getItem(SESSION_LOCATION);
          // }
          // history.replace(targetPath ? targetPath : "/");
          // window &&
          //   window.sessionStorage &&
          //   // @ts-ignore
          //   window.sessionStorage.removeItem(SESSION_LOCATION);
          history.replace("/");
        }
      })
      .catch(err => {
        setSubmiting(false);
        if (err.data && err.data.fields) {
          setFields(err.data.fields);
          refreshCaptcha();
        }
      });
  };
  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: "title.login" })}</title>
      </Helmet>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h3>{formatMessage({ id: "title.login" })}</h3>
            <p>
              <Tooltip title={formatMessage({ id: "tips.login.suggest" })}>
                <BulbFilled style={{ marginRight: "5px", color: "#ffa940" }} />
              </Tooltip>
              {formatMessage({ id: "tips.login" })}
            </p>
          </div>
          <div className={styles.form}>
            <Form
              className="hidden-label"
              fields={fields}
              onFinish={handleFormFinish}
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder={formatMessage({ id: "field.username" })}
                  size="large"
                  disabled={submiting}
                />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={formatMessage({ id: "field.password" })}
                  size="large"
                  disabled={submiting}
                />
              </Form.Item>
              <Form.Item
                label="验证码"
                name="code"
                rules={[{ required: true }]}
              >
                <Input
                  prefix={<SafetyCertificateOutlined />}
                  placeholder={formatMessage({ id: "field.verify-code" })}
                  addonAfter={
                    captcha === "" ? (
                      <div className={styles.captcha}>
                        <LoadingOutlined />
                      </div>
                    ) : (
                      <Tooltip
                        title={formatMessage({ id: "tips.captcha.refresh" })}
                      >
                        <img
                          src={captcha}
                          height="38"
                          onClick={() => {
                            refreshCaptcha();
                          }}
                        />
                      </Tooltip>
                    )
                  }
                  size="large"
                  disabled={submiting}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submiting}
                  block
                >
                  {formatMessage({ id: "action.login" })}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className={styles.provide}>
            Provide to <Logo />
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(({ auth }: any) => ({
  auth
}))(Page);
