import React, { Component } from "react";

import Image from "next/image";

import { Context } from "./Context";

import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

import styles from "../styles/contextToggle.module.css";

import lightIcon from "../public/icon/light.svg";
import darkIcon from "../public/icon/dark.svg";

class ContextToggle extends Component {
  static contextType = Context;
  render() {
    return (
      <button className={styles.container} onClick={this.context.toggleTheme}>
        {this.context.isLight ? (
          <DarkModeRoundedIcon className={styles.button} />
        ) : (
          <LightModeRoundedIcon className={styles.button} />
        )}
      </button>
    );
  }
}

export default ContextToggle;
