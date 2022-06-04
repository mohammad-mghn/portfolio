import React from "react";

import Link from "next/link";

import styles from "../styles/button.module.css";

const Button = (props) => {
  console.log(styles);
  const { href, text, containerClassname, scrollerClassname } = props;
  return (
    <Link href={href}>
      <a className={`${styles.container} ${props.containerClassName}`}>
        <span
          className={`${styles.scroller} ${props.scrollerClassName}`}
        ></span>
        <div className={styles.text}>{text}</div>
      </a>
    </Link>
  );
};

export default Button;
