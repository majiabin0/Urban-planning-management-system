import React from "react";
import { Layout, Button } from "antd";
import { useIntl } from "umi";
import styles from "./styles/Footer.less";

export default () => {
  const { formatMessage } = useIntl();
  return (
    <Layout.Footer className={styles.footer}>
      <div className={styles.copyright}>
        <a href="https://mooween.com/" target="_blank">
          MOOWEEN
        </a>{" "}
        &copy; {new Date().getFullYear()}
      </div>
      <menu>
        <div>
          <Button type="link">{formatMessage({ id: "help" })}</Button>
        </div>
        <div>
          <Button type="link">{formatMessage({ id: "feedback" })}</Button>
        </div>
      </menu>
    </Layout.Footer>
  );
};
