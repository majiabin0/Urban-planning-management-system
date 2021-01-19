import React, { useEffect } from "react";
import { ConfigProvider } from "antd";
import { useIntl, Helmet, connect, useModel } from "umi";

// import Error404 from "@/components/Error404";

import BasicLayout from "./BasicLayout";
import GuestLayout from "./GuestLayout";

const useGuest: string[] = ["/login", "/discontinue"];

const Layout: React.FC<{
  [key: string]: any;
}> = props => {
  // const { initialState } = useModel("@@initialState");

  // useEffect(() => {
  //   props.dispatch({
  //     type: "global/setKeys",
  //     payload: {
  //       keys: initialState?.keys
  //     }
  //   });
  //   return () => {}
  // }, [])

  const { formatMessage, messages } = useIntl();

  // const exist =
  //   (props.route.routes &&
  //     props.route.routes.findIndex(
  //       route => props.location.pathname === route.path
  //     )) !== -1;

  // const children = !exist ? <Error404 /> : props.children;

  const children = props.children;

  let layout = null;
  let activeNav: string[] = [];
  if (props.location.pathname === "/") {
    activeNav = ["home"];
  } else {
    let pathstart = props.location.pathname.replace(/\//, '').split("/");
    activeNav = [pathstart[0]];
  }
  if (useGuest.indexOf(props.location.pathname) !== -1) {
    layout = <GuestLayout>{children}</GuestLayout>;
  } else {
    layout = <BasicLayout active={activeNav}>{children}</BasicLayout>;
  }

  const validateMessages: any = messages.validate;

  return (
    <>
      <Helmet
        titleTemplate={`%s - ${formatMessage({ id: "title" })}`}
        defaultTitle={formatMessage({ id: "title" })}
      />
      <ConfigProvider form={{ validateMessages }}>{layout}</ConfigProvider>
    </>
  );
};

export default Layout;
