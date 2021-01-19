import React from "react";
import styles from "./styles/Loading.less";

export default () => {
  return (
    <div className={styles.loading}>
      <svg viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" fill="none" />
      </svg>
    </div>
  );
};
