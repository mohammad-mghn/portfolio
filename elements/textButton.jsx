import React from "react";

import styles from "../styles/textButton.module.css";

const TextButton = ({ onClick, text, className, style }) => {
  return (
    <button
      style={style}
      className={`${styles.button} ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default TextButton;
