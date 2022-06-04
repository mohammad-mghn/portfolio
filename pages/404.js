import React, { useEffect } from "react";

import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import VIcon from "../public/V-icon.svg";

import styles from "../styles/404.module.css";

const Error404 = () => {
  const router = useRouter();

  const leftArray = [
    { left: 1, delay: 300 },
    { left: 4, delay: 643 },
    { left: 8, delay: 100 },
    { left: 12, delay: 200 },
    { left: 16, delay: 133 },
    { left: 20, delay: 1400 },
    { left: 24, delay: 900 },
    { left: 28, delay: 600 },
    { left: 32, delay: 370 },
    { left: 36, delay: 230 },
    { left: 40, delay: 500 },
    { left: 44, delay: 170 },
    { left: 48, delay: 90 },
    { left: 52, delay: 700 },
    { left: 56, delay: 467 },
    { left: 60, delay: 356 },
    { left: 63, delay: 870 },
    { left: 70, delay: 440 },
    { left: 74, delay: 150 },
    { left: 78, delay: 380 },
    { left: 82, delay: 840 },
    { left: 86, delay: 650 },
    { left: 90, delay: 330 },
    { left: 94, delay: 187 },
    { left: 92, delay: 430 },
    { left: 1, delay: 160 },
    { left: 2, delay: 60 },
    { left: 8, delay: 150 },
    { left: 12, delay: 130 },
    { left: 16, delay: 30 },
    { left: 20, delay: 200 },
    { left: 24, delay: 10 },
    { left: 28, delay: 210 },
    { left: 32, delay: 140 },
    { left: 36, delay: 47 },
    { left: 40, delay: 40 },
    { left: 44, delay: 140 },
    { left: 48, delay: 110 },
    { left: 52, delay: 723 },
    { left: 56, delay: 420 },
    { left: 60, delay: 345 },
    { left: 63, delay: 160 },
    { left: 70, delay: 450 },
    { left: 14, delay: 546 },
    { left: 28, delay: 545 },
    { left: 82, delay: 85 },
    { left: 86, delay: 650 },
    { left: 13, delay: 356 },
    { left: 91, delay: 156 },
    { left: 94, delay: 445 },
    { left: 42, delay: 567 },
    { left: 25, delay: 520 },
    { left: 50, delay: 320 },
    { left: 53, delay: 120 },
    { left: 76, delay: 450 },
    { left: 64, delay: 500 },
    { left: 78, delay: 330 },
    { left: 62, delay: 672 },
    { left: 84, delay: 650 },
    { left: 23, delay: 350 },
    { left: 32, delay: 167 },
    { left: 54, delay: 456 },
    { left: 44, delay: 156 },
    { left: 78, delay: 330 },
    { left: 62, delay: 732 },
    { left: 86, delay: 350 },
    { left: 28, delay: 150 },
    { left: 36, delay: 806 },
    { left: 95, delay: 400 },
  ];

  const error404Handler = () => {
    router.push("/");
  };

  setTimeout(error404Handler, 10000);

  return (
    <div className={styles.container}>
      <Head>
        <title>Error 404</title>
        <link rel="icon" href="../V-icon.svg" />
      </Head>
      {leftArray.map((item, index) => (
        <h4
          key={index}
          style={{
            left: item.left + "vw",
            animationDelay: item.delay + "ms",
          }}
          className={styles.Error404Rain}
        >
          404
        </h4>
      ))}
      <div className={styles.informationBoxContainer}>
        <div className={styles.informationBox}>
          <img src={VIcon.src} alt="" className={styles.VIcon} />
          <p className={styles.informationText}>
            Sorry this page doesn’t <br />
            find. redirect to{" "}
            <span className={styles.homepageLink}>
              <Link href="/">Homepage</Link>
            </span>
            <span className={styles.descriptionText}>
              <br />
              after 10 seconds.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error404;
