import React from "react";
import Cookies from "js-cookie";
import { Modal, Layout, Button, Avatar, Dropdown, Menu } from "antd";
import { useIntl, useModel, history } from "umi";
import * as services from "@/services/auth";
import { SearchOutlined } from "@ant-design/icons";
import Icon from "./Icon";
import styles from "./styles/Header.less";

const Header: React.FC<{
  title?: React.ReactNode;
  style?: {};
  actions?: React.ReactNode;
}> = props => {
  const { refresh } = useModel("@@initialState");
  const { formatMessage } = useIntl();

  return (
    <Layout.Header
      className={styles.header}
      style={props.style ? props.style : {}}
    >
      <div
        className="d-flex align-items-center"
        style={{
          flex: "1 1 auto"
        }}
      >
        {props.title ? (
          <>
            <Icon
              type="back"
              style={{
                fontSize: "20px",
                opacity: ".35",
                marginRight: "10px",
                cursor: "pointer"
              }}
              onClick={() => {
                history.goBack();
              }}
            />
            <div className={styles.title} style={{ margin: 0 }}>
              {props.title}
            </div>
          </>
        ) : null}
        {props.children}
      </div>
      <div className="d-flex align-items-center">
        {props.actions}
        <Dropdown
          overlayStyle={{
            minWidth: "120px"
          }}
          overlay={
            <Menu>
              <Menu.Item
                onClick={e => {
                  e.domEvent.stopPropagation();
                  // setTimeout(() => {
                  //   history.push("/profile");
                  // }, 80);
                }}
              >
                {formatMessage({ id: "menu.profile" })}
              </Menu.Item>
              <Menu.Item>{formatMessage({ id: "menu.password" })}</Menu.Item>
              <Menu.Divider />
              <Menu.Item
                danger
                onClick={e => {
                  e.domEvent.stopPropagation();
                  const clearToken = () => {
                    // @ts-ignore
                    Cookies.remove(COOKIE_TOKEN);
                    window &&
                      window.sessionStorage &&
                      window.sessionStorage.clear();
                    window &&
                      window.localStorage &&
                      window.localStorage.clear();
                    refresh();
                    setTimeout(() => {
                      history.replace("/login");
                    }, 200)
                  };
                  Modal.confirm({
                    title: formatMessage({ id: "tips" }),
                    content: formatMessage({ id: "ask.logout" }),
                    onCancel: () => {},
                    onOk: () => {
                      services
                        .signout()
                        .then(() => {
                          clearToken();
                        })
                        .catch(() => {
                          clearToken();
                        });
                    }
                  });
                }}
              >
                {formatMessage({ id: "menu.logout" })}
              </Menu.Item>
            </Menu>
          }
        >
          <Avatar icon={<Icon type="user" />} />
        </Dropdown>
      </div>
    </Layout.Header>
  );
};

export default Header;
