import React from "react";
import { Layout, Empty } from "antd";
import { Helmet, useIntl } from "umi";
import Header from "@/components/Header";

const Page = () => {
  const { formatMessage } = useIntl();
  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: "title.home" })}</title>
      </Helmet>
      <Header />
      <Layout.Content>
        <Empty
          image={require("@/assets/images/come-soon.png")}
          imageStyle={{
            height: 300
          }}
          description="⚠️ 此页正在施工中 ..."
        />
      </Layout.Content>
    </>
  );
};

export default Page;
