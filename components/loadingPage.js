import React from "react";

import Image from "next/image";

import styles from "../styles/loadingPage.module.css";

import VIcon from "../public/V-icon.svg";

const LoadingPage = (props) => {
  console.log(props.visibility);
  return (
    <div
      className={styles.container}
      style={{ display: props.visibility ? "flex" : "none" }}
    >
      <Image src={VIcon} alt="vito-mohagheghian-icon" height={95} width={95} />
      <div className={styles.loadingBar}>
        <span className={styles.loadingTrack}></span>
      </div>
    </div>
  );
};

export default LoadingPage;
