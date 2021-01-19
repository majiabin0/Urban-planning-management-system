import React from "react";
import { useIntl, Helmet } from "umi";
import { Layout, Empty } from "antd";
import Header from "@/components/Header";

const Page: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: "title.content" })}</title>
      </Helmet>
      <Header
        title={formatMessage({ id: "title.content" })}
        style={{
          borderBottom: "1px solid #eee"
        }}
      />
      <Layout.Content className="d-flex align-items-center justify-content-center">
        <Empty
          image={require("@/assets/images/empty.svg")}
          imageStyle={{
            height: 150
          }}
          style={{
            marginTop: "-150px"
          }}
          description={<>{formatMessage({ id: "tips.select.type.content" })}</>}
        />
      </Layout.Content>
    </>
  );
};

export default Page;
