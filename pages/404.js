import React, { useEffect } from "react";

import Link from "next/link";
import Image from "next/image";

import Header from "../modules/head";
import { useRouter } from "next/router";

import VIcon from "../public/V-icon.svg";

import styles from "../styles/404.module.css";

const Error404 = () => {
  const router = useRouter();

  // with children like {left:100, delay:1000} as an example
  var Error404Headers = [];

  const generateRandom = (maxLimit = 100) => {
    // generate a floating number which is in range of 1 to 0
    // to so to make it between zero to our maximum limit multiply it to our maximum number.
    let randomNum = Math.random() * maxLimit;

    // but still it's floating, so floor method makes it integer number which is needed
    // however floating is cool but to for css processing.
    randomNum = Math.floor(randomNum);

    return randomNum;
  };

  const Error404HeadersGenerater = () => {
    for (let i = 0; i <= 105; i++) {
      Error404Headers.push({
        left: generateRandom(100),
        delay: generateRandom(1000),
      });
    }
  };
  Error404HeadersGenerater();

  const error404Handler = () => {
    router.push("/");
  };

  useEffect(() => {
    setTimeout(error404Handler, 10000);
    return () => {
      clearTimeout();
    };
  }, []);

  return (
    <>
      <Header
        title="Vito Mohagheghian • Error 404"
        description={"Vito Mohagheghian doesn't create any page with this url."}
      />
      <div className={styles.container}>
        {Error404Headers.map((item, index) => (
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
            <Image src={VIcon.src} alt="" height={75} width={85} />
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
    </>
  );
};

export default Error404;
