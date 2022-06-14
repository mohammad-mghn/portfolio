import React from "react";

import styles from "../styles/rate.module.css";

const Rate = (props) => {
  return (
    <div className={styles.rate}>
      <h4 className={styles.title}>{props.title}</h4>
      <div className={styles.rate_track}>
        <div
          style={{ width: props.rate + "%" }}
          className={styles.rate_thumb}
        ></div>
      </div>
    </div>
  );
};

export default Rate;
