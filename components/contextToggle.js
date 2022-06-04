import React, { Component } from "react";

import Image from "next/image";

import { Context } from "./Context";

import styles from "../styles/contextToggle.module.css";

import lightIcon from "../public/icon/light.svg";
import darkIcon from "../public/icon/dark.svg";

class ContextToggle extends Component {
  static contextType = Context;
  render() {
    return (
      <div className={styles.container}>
        <button
          className={styles.themeButton}
          onClick={this.context.toggleTheme}
        >
          <Image
            src={!this.context.isLight ? lightIcon : darkIcon}
            width={!this.context.isLight ? "25%" : "20%"}
            height={!this.context.isLight ? "25%" : "20%"}
            alt="theme icon"
          />
        </button>
      </div>
    );
  }
}

export default ContextToggle;