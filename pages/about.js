import React, { useState } from "react";

import Image from "next/image";

import Header from "../components/head";
import Button from "../elements/button";

import AboutLandingImage from "../public/about_landing_image.png";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

import styles from "../styles/about.module.css";

import TypingAnimation from "../components/typingAnimation";
import Rate from "../elements/rate";

import LoadingPage from "../components/loadingPage";

const useMountEffect = (fun) => React.useEffect(fun, []);
const About = () => {
  var fetched = false;
  async function addpostHandler() {
    var fetched = false;
    if (!fetched) {
      const response = await fetch("/api/aboutPage");
      const data = await response.json();
      console.log(JSON.parse(data));
      var fetched = true;
    }
  }
  useMountEffect(() => {
    console.log("sd");
    addpostHandler();
    console.log(fetched);
  });
  // toggle scroll down component visiibility
  const [scrollDown, setScrollDown] = React.useState(true);

  React.useEffect(() => {
    const onScroll = () => {
      if (window.pageYOffset != 0) {
        setScrollDown(false);
      } else {
        setScrollDown(true);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  var htttt = `In 2005, I was born inEsfahatly I’m living in Esfahatly I’m living in Esfafa
  hatly I’m living in Esfahatly I’m living in Esfafahatly I’m living in Esfahatly I’m living in 
  Esfafahatly I’m living in Esfahatly I’m living in Esfafahatly I’m living in Esfahatly I’m livi
  ng in Esfahan. Since 2020, I started learning the programming profession. At first, I was wo
  rking with Python, over time I changed my mind, and today, I’m a web developer generally. I’m 
  interested in Web development, especially Front-end, as well as UI / UX, and SEO. I’ve been deve
  loping websites in JavaScript since 2021. You probably know which I’m creating content about 
  programming, and techs in some social media like Instagram, and so on. It’s clear that I’m a
   Linux fan, and to get to know me better, I provided some information about myself myself below.`;

  var skills = {
    leftSide: [
      { title: "Javascript", rate: 75 },
      { title: "Html/Css", rate: 50 },
      { title: "UI/UX", rate: 60 },
      { title: "Git/Github", rate: 10 },
      { title: "Word", rate: 20 },
      { title: "cmd", rate: 20 },
      { title: "SEO", rate: 60 },
      { title: "Javascript", rate: 10 },
    ],
    rightSide: [
      { title: "React.js", rate: 60 },
      { title: "Next.js", rate: 90 },
      { title: "Responsive Design", rate: 100 },
      { title: "Ps/Pr adobe", rate: 10 },
      { title: "Web security", rate: 60 },
      { title: "Test/debugging", rate: 40 },
      { title: "Teamwork", rate: 100 },
      { title: "Bootstrap/SASS", rate: 10 },
    ],
  };

  var tools = {
    leftSide: [
      { title: "Javascript", rate: 75 },
      { title: "Html/Css", rate: 50 },
      { title: "UI/UX", rate: 60 },
      { title: "Git/Github", rate: 10 },
      { title: "Word", rate: 20 },
      { title: "cmd", rate: 20 },
      { title: "SEO", rate: 60 },
      { title: "Javascript", rate: 10 },
    ],
    rightSide: [
      { title: "React.js", rate: 60 },
      { title: "Next.js", rate: 90 },
      { title: "Responsive Design", rate: 100 },
      { title: "Ps/Pr adobe", rate: 10 },
      { title: "Web security", rate: 60 },
      { title: "Test/debugging", rate: 40 },
      { title: "Teamwork", rate: 100 },
      { title: "Bootstrap/SASS", rate: 10 },
    ],
  };
  var languages = {
    leftSide: [{ title: "Javascript", rate: 75 }],
    rightSide: [{ title: "React.js", rate: 60 }],
  };

  return (
    <main className={styles.container}>
      <Header
        title="Vito Mohagheghian • About"
        description="Vito mohagheghian's autobiography and skills"
      />
      <section className={styles.cover}>
        <div className={styles.cover_headers}>
          <h1 className={styles.main_header}>
            How am I and <br /> What I’m great at ?
          </h1>
          <TypingAnimation
            content={["Js/React developer.", "UI designer.", "a freelancer."]}
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
            In which I’m really
            <br /> pasionate in learning and coding.
          </p>
          <Button
            text="Contact"
            href="/contact"
            containerClassName={styles.button_container}
            scrollerClassName={styles.button_scroller}
          />
        </div>
        <div className={styles.cover_image}>
          <Image
            src={AboutLandingImage}
            height={475}
            width={425}
            alt="About illustration"
          />
        </div>
        <div
          onClick={() => {
            if (typeof window !== "undefined") {
              // 10000 is calculated by the longest page
              // Y offset, and in as the least as possible webview's width.
              window.scrollTo(0, 2000);
            }
          }}
          className={styles.scroll_to_down}
          style={{ display: scrollDown ? "flex" : "none" }}
        >
          <KeyboardDoubleArrowDownIcon className={styles.arrowIcon} />
          Scroll to down
          <KeyboardDoubleArrowDownIcon className={styles.arrowIcon} />
        </div>
      </section>
      <section
        data-aos="zoom-in"
        data-aos-anchor-placement="center-bottom"
        className={styles.biography_and_details}
      >
        <div className={styles.autobiography}>
          <h2 className={styles.sections_header}>Autobiography</h2>
          <p
            className={styles.autobiography_paragraph}
            dangerouslySetInnerHTML={{
              __html: htttt,
            }}
          ></p>
        </div>
        <div className={styles.horizantal_line}></div>
        <div className={styles.biography_details}>
          <h2 className={styles.details_header}>Details</h2>
          <div className={styles.details_child}>
            <h3 className={styles.details_child_header}>Nickname</h3>
            <h1 className={styles.details_child_text}>Vito Mohagheghian</h1>
          </div>
          <div className={styles.details_child}>
            <h3 className={styles.details_child_header}>Location:</h3>
            <h2 className={styles.details_child_text}>
              Esfahan, Iran, Asia, Earth
            </h2>
          </div>
          <div className={styles.details_child}>
            <h3 className={styles.details_child_header}>Name:</h3>
            <h2 className={styles.details_child_text}>Mohammad Mohagheghian</h2>
          </div>
        </div>
      </section>
      <div className={styles.vertical_line}></div>
      <section className={styles.skills}>
        <div className={styles.sections_header}>Skills</div>
        <div className={styles.rates}>
          <div style={{ width: "100%" }}>
            {" "}
            {skills.leftSide.map((skill, index) => (
              <Rate title={skill.title} rate={skill.rate} key={index} />
            ))}
          </div>
          <div className={styles.horizantal_line}></div>
          <div style={{ width: "100%" }}>
            {" "}
            {skills.rightSide.map((skill, index) => (
              <Rate title={skill.title} rate={skill.rate} key={index} />
            ))}
          </div>
        </div>
      </section>
      <div className={styles.vertical_line}></div>
      <section className={styles.skills}>
        <div className={styles.sections_header}>Languages</div>
        <div className={`${styles.rates} ${styles.rates_tools}`}>
          <div style={{ width: "100%" }}>
            {" "}
            {languages.leftSide.map((skill, index) => (
              <Rate title={skill.title} rate={skill.rate} key={index} />
            ))}
          </div>
          <div className={styles.horizantal_line}></div>
          <div style={{ width: "100%" }}>
            {" "}
            {languages.rightSide.map((skill, index) => (
              <Rate title={skill.title} rate={skill.rate} key={index} />
            ))}
          </div>
        </div>
      </section>
      <div className={styles.vertical_line}></div>
      <section className={styles.skills}>
        <div className={styles.sections_header}>Tools</div>
        <div className={styles.rates}>
          <div style={{ width: "100%" }}>
            {" "}
            {tools.leftSide.map((skill, index) => (
              <Rate title={skill.title} rate={skill.rate} key={index} />
            ))}
          </div>
          <div className={styles.horizantal_line}></div>
          <div style={{ width: "100%" }}>
            {" "}
            {tools.rightSide.map((skill, index) => (
              <Rate title={skill.title} rate={skill.rate} key={index} />
            ))}
          </div>
        </div>
      </section>
      <div className={styles.vertical_line}></div>
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
          The only place where success comes before work is in the dictionary.
        </h3>
        <h6 className={styles.footer_writer}>Vidal Sassoon</h6>
      </section>
    </main>
  );
};

export default About;
