import React from "react";

import styles from "../styles/textButton.module.css";

const TextButton = ({ onClick, text, className }) => {
  return (
    <button className={`${styles.button} ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default TextButton;
