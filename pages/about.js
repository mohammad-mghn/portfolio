import React from "react";

import Image from "next/image";

import Header from "../components/head";
import Button from "../elements/button";

import AboutLandingImage from "../public/about-landing-image.png";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

import styles from "../styles/about.module.css";

import TypingAnimation from "../components/typingAnimation";
const About = () => {
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

  var htttt = `<span className={styles.paragraph_starting}></span>In 2005, I was
  born in Esfahan, Iran. Since 2020 ,I entered the programming
  profession. At first, I started with Python . Afterward, entered web
  developing. Currently, I’m an web developer generally. Mostly worked
  in front-end and web designing, as I’m intersted in SEO, UI and UX .
  I’ve been playing santur(Iraninan musical instrument), I’m also
  playing badminton in semi-professional face as well.ing. Currently,
  I’m an web developer generally. Mostly worked in front-end and web
  designing, as I’m intersted in SEO, UI and UX. I’ve been playing
  santur(Iraninan musical instrument), I’m also playing badminton in
  <b>semi-professional</b> face as ng badminton in semi-professional
  face as in semi-professional face asin semi-professional face as`;

  var skillsRight = [
    { title: "Javascript", rate: 60 },
    { title: "Javascript", rate: 0 },
    { title: "Javascript", rate: 100 },
    { title: "Javascript", rate: 10 },
  ];
  var skillsLeft = [
    { title: "Javascript", rate: 20 },
    { title: "Javascript", rate: 20 },
    { title: "Javascript", rate: 60 },
    { title: "Javascript", rate: 10 },
  ];
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
            containerClassName={styles.contact_button}
            scrollerClassName={styles.contact_button_scroller}
          />
        </div>
        <div className={styles.cover_image}>
          <Image src={AboutLandingImage} height={475} width={425} />
        </div>
        <div
          onClick={() => {
            if (typeof window !== "undefined") {
              // 10000 is calculated by the longest page
              // Y offset, and in as the least as possible webview's width.
              window.scrollTo(0, 10000);
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
      <section className={styles.biography_and_details}>
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
          {skillsLeft.map(skill => (<div className={styles.rate}></div>))}
        </div>
      </section>
    </main>
  );
};

export default About;
