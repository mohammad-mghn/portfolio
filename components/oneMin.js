import React from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import styles from "../styles/oneMin.module.css";

const OneMin = ({ setOneMin, OneMin }) => {
  return (
    <>
      {OneMin && (
        <>
          <div
            className={styles.closer}
            onClick={() => {
              setOneMin(false);
            }}
          ></div>
          <div className={styles.container}>
            Thank you very much for staying
            <br /> on my site for 1 minute
            <br />
            <span className={styles.love}>❤️</span>
            <button
              onClick={() => {
                setOneMin(false);
              }}
              className={styles.close_button}
            >
              <CloseRoundedIcon />
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default OneMin;
