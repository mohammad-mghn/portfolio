import React, { useState, useEffect } from "react";

import Image from "next/image";

import Header from "../modules/head";
import Button from "../elements/button";
import LoadingPage from "../components/loadingPage";
import RatesSection from "../components/ratesSection";
import TypingAnimation from "../components/typingAnimation";

import AboutLandingImage from "../public/about_landing_image.svg";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { motion, AnimatePresence } from "framer-motion";

import styles from "../styles/about.module.css";

const Variants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      DelayNode: 1,
    },
  },
};

const About = () => {
  const [Loading, setLoading] = useState(true);
  const [data, setData] = useState([
    {
      autobiography: "Loading",
      skills: {
        leftSide: [
          {
            title: "Loading",
            rate: 100,
          },
        ],
        rightSide: [
          {
            title: "Loading",
            rate: 100,
          },
        ],
      },
      tools: {
        leftSide: [
          {
            title: "Loading",
            rate: 100,
          },
        ],
        rightSide: [
          {
            title: "Loading",
            rate: 100,
          },
        ],
      },
      languages: {
        leftSide: [
          {
            title: "Loading ",
            rate: 100,
          },
        ],
        rightSide: [
          {
            title: "React.js",
            rate: 100,
          },
        ],
      },
    },
  ]);

  useEffect(() => {
    const addposthandler = () => {
      if (localStorage.getItem("vito-portfolio-about") === null) {
        fetch("api/aboutPage")
          .then((response) => response.json())
          .then((data) => {
            setLoading(false);
            setData(JSON.parse(data));
            console.log(data);
            localStorage.setItem("vito-portfolio-about", data);
          });
      } else {
        setLoading(false);
        setData(JSON.parse(localStorage.getItem("vito-portfolio-about")));
      }
    };
    addposthandler();

    const onScroll = () => {
      if (window.pageYOffset != 0) {
        // setScrollDown(false);
        document.getElementById("scrollToDown").style.display = "none";
      } else {
        // setScrollDown(true);
        document.getElementById("scrollToDown").style.display = "flex";
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <Header
        title="Vito Mohagheghian • About"
        description="Vito mohagheghian's autobiography and skills"
      />
      <LoadingPage visibility={Loading} />
      <AnimatePresence>
        <main className={styles.container}>
          <section className={styles.cover}>
            <div className={styles.cover_headers}>
              <h1 className={styles.main_header}>
                How am I and <br /> What I&rsquo;m great at ?
              </h1>
              <TypingAnimation
                content={[
                  "Js/React developer.",
                  "UI designer.",
                  "a freelancer.",
                ]}
                Typingspeed={75}
                deletingSpeed={50}
                deletePauseTime={750}
                typePauseTime={0}
                containerClassName={styles.typingContainer}
                PrimaryTextClassName={styles.typingPrimaryText}
                typingClassName={styles.typingText}
                cursorClassName={styles.tyingCursor}
              />
              <p className={styles.short_description}>
                In which I&rsquo;m really
                <br /> pasionate in learning and coding.
              </p>
              <Button
                text="Contact"
                href="/contact"
                containerClassName={styles.button_container}
                scrollerClassName={styles.button_scroller}
              />
            </div>
            <Image
              src={AboutLandingImage}
              height={500}
              width={500}
              alt="About illustration"
            />
            <div
              onClick={() => {
                if (typeof window !== "undefined") {
                  // 10000 is calculated by the longest page
                  // Y offset, and in as the least as possible webview's width.
                  window.scrollTo(0, 2000);
                }
              }}
              className={styles.scroll_to_down}
              id="scrollToDown"
            >
              <KeyboardDoubleArrowDownIcon className={styles.arrowIcon} />
              Scroll to down
              <KeyboardDoubleArrowDownIcon className={styles.arrowIcon} />
            </div>
          </section>
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            exit="exit"
            viewport={{ amount: 0.4 }}
          >
            <section className={styles.biography_and_details}>
              <div className={styles.autobiography}>
                <motion.div variants={Variants}>
                  <h2 className={styles.sections_header}>Autobiography</h2>
                  <p
                    className={styles.autobiography_paragraph}
                    dangerouslySetInnerHTML={{
                      __html: data[0].autobiography,
                    }}
                  ></p>
                </motion.div>
              </div>
              <div
                className={styles.horizantal_line}
                style={{ height: "85%" }}
              ></div>
              <div className={styles.biography_details}>
                <motion.div variants={Variants}>
                  <h2 className={styles.details_header}>Details</h2>
                  <div className={styles.details_child}>
                    <h3 className={styles.details_child_header}>Nickname</h3>
                    <h1 className={styles.details_child_text}>
                      Vito Mohagheghian
                    </h1>
                  </div>
                  <div className={styles.details_child}>
                    <h3 className={styles.details_child_header}>Location:</h3>
                    <h2 className={styles.details_child_text}>
                      Esfahan, Iran, Asia, Earth
                    </h2>
                  </div>
                  <div className={styles.details_child}>
                    <h3 className={styles.details_child_header}>Name:</h3>
                    <h2 className={styles.details_child_text}>
                      Mohammad Mohagheghian
                    </h2>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>

          <div className={styles.vertical_line}></div>

          <RatesSection rates={data[0].skills} title={"Skills"} />
          <RatesSection rates={data[0].languages} title={"Languages"} />
          <RatesSection rates={data[0].tools} title={"Tools"} />

          <section className={styles.skills}>
            <div className={styles.sections_header}>Projects</div>
            <div className={styles}></div>
            <div className={styles.projects_container}>
              <div className={styles.projects_child}>
                <h5 className={styles.projects_text}>
                  To see my codes check my{" "}
                  <span className={styles.bold_link}>Github</span>, Or check{" "}
                  <span className={styles.bold_link}>Projects</span> page.
                </h5>
              </div>
            </div>
          </section>
          <div className={styles.vertical_line}></div>
          <section className={styles.footer_container}>
            <h3 className={styles.footer_heading}>
              The only place where success comes before work is in the
              dictionary.
            </h3>
            <h6 className={styles.footer_writer}>Vidal Sassoon</h6>
          </section>
        </main>
      </AnimatePresence>
    </>
  );
};

export default About;
