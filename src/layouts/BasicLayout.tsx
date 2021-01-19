import React, { useState, useEffect } from "react";
import { Layout, Button, Menu } from "antd";
import {
  MenuOutlined,
  HomeFilled,
  ContainerFilled,
  IdcardFilled,
  LayoutFilled,
  SettingFilled,
  HddFilled,
  BuildFilled
} from "@ant-design/icons";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { useIntl, history } from "umi";
import styles from "./BasicLayout.less";

const BasicLayout: React.FC<{
  active?: string[];
}> = props => {
  const { formatMessage } = useIntl();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleCollapsed = () => {
      if (window.innerWidth < 1200) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleCollapsed();
    window.addEventListener("resize", handleCollapsed);
    return () => {
      window.removeEventListener("resize", handleCollapsed);
    };
  }, []);

  document.body.classList.add("has-collapsed");

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add("min-collapsed");
    } else {
      document.body.classList.remove("min-collapsed");
    }
    return () => {};
  }, [collapsed]);

  return (
    <Layout className={styles.layout} hasSider>
      <Layout.Sider
        className={styles.sider}
        collapsible={false}
        collapsed={collapsed}
        // @ts-ignore
        width={LAYOUT_SIDER_WIDTH}
        // @ts-ignore
        collapsedWidth={LAYOUT_SIDER_WIDTH_MIN}
      >
        <Layout.Header
          className={`d-flex align-items-center ${
            !collapsed
              ? "justify-content-space-between"
              : "justify-content-center"
          } ${styles.logo}`}
        >
          {!collapsed ? <Logo /> : null}
          <Button
            type="text"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            icon={!collapsed ? <MenuOutlined /> : <Icon type="ellipsis-v" />}
          />
        </Layout.Header>
        <Layout.Content
          className={`d-flex flex-direction-column justify-content-space-between align-items-stretch ${styles.nav}`}
        >
          <Menu mode="inline" selectedKeys={props.active} multiple={false}>
            <Menu.Item
              key="home"
              icon={<HomeFilled />}
              onClick={() => {
                history.push("/");
              }}
            >
              {formatMessage({ id: "nav.home" })}
            </Menu.Item>
            <Menu.Item
              key="content"
              icon={<ContainerFilled />}
              onClick={() => {
                history.push("/content");
              }}
            >
              {formatMessage({ id: "nav.content" })}
            </Menu.Item>
            {/* <Menu.Item key="member" icon={<IdcardFilled />}>
              {formatMessage({ id: "nav.member" })}
            </Menu.Item> */}
            {/* <Menu.Item key="template" icon={<LayoutFilled />}>
              {formatMessage({ id: "nav.template" })}
            </Menu.Item> */}
            <Menu.Item
              key="plugin"
              icon={<BuildFilled />}
              onClick={() => {
                history.push("/plugin");
              }}
            >
              {formatMessage({ id: "nav.plugin" })}
            </Menu.Item>
            {/* <Menu.Item key="backup" icon={<HddFilled />}>
              {formatMessage({ id: "nav.backup" })}
            </Menu.Item> */}
            <Menu.Item
              key="settings"
              icon={<SettingFilled />}
              onClick={() => {
                history.push("/settings");
              }}
            >
              {formatMessage({ id: "nav.settings" })}
            </Menu.Item>
            <Menu.Item
                key="member"
                icon={<SettingFilled />}
                onClick={() => {
                  history.push("/member");
                }}
            >
              {formatMessage({ id: "nav.member" })}
            </Menu.Item>
          </Menu>
        </Layout.Content>
      </Layout.Sider>
      <Layout
        className={styles.main}
        style={{
          // @ts-ignore
          marginLeft: collapsed ? LAYOUT_SIDER_WIDTH_MIN : LAYOUT_SIDER_WIDTH
        }}
      >
        {props.children}
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
