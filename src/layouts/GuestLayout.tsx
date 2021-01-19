import React from "react";
import styles from "./GuestLayout.less";

const GuestLayout: React.FC = props => {
  return <div className={styles.layout}>{props.children}</div>;
};

export default GuestLayout;
