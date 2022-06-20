import { useEffect, memo } from "react";

import Header from "../modules/head";
import Button from "../elements/button";

import AllInOne from "../public/all-in-one.png";

import styles from "../styles/Home.module.css";

function Home() {
  return (
    <div className={styles.home_container}>
      <Header
        title="Vito Mohagheghian"
        description="vito mohagheghian portfolio and blog"
      />
      <main className={styles.container}>
        <div className={styles.main_container}>
          <p className={styles.hi_txt}>hi I&apos;m</p>
          <h1 className={styles.name_header}>
            Vito
            <br />
            Mohagheghian
          </h1>
          <h2 className={styles.description} translate="yes">
            I&apos;m a JavaScript and React.js developer, and UI designer with
            short but effectual experience.
          </h2>
          <Button
            text="About"
            href="/about"
            containerClassName={styles.contact_button}
            scrollerClassName={styles.contact_button_scroller}
          />
        </div>
        <div className={styles.sidebar} data-number="Jun 20, 2020">
          <img
            src={AllInOne.src}
            alt="vito mohagheghian informations"
            className={styles.allione}
          />
        </div>
      </main>
    </div>
  );
}
export default memo(Home);
