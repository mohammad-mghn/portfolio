import React from "react";

import { Navigation, Keyboard } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import ArchitectureRoundedIcon from "@mui/icons-material/ArchitectureRounded";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import styles from "../styles/projects.module.css";

const Project = (props) => {
  const { covers, description, title, options, date } = props.project;

  // get this moment time
  const nowDate = new Date();

  // https://www.npmjs.com/package/javascript-time-ago
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  return (
    <section className={styles.project}>
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={true}
        keyboard={true}
        modules={[Navigation, Keyboard]}
        className={styles.slider}
      >
        {covers.map((cover, index) => (
          <SwiperSlide className={styles.slide} key={index}>
            <img src={cover} className={styles.cover} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.project_details}>
        <h2 className={styles.title}>{title}</h2>

        <p
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: description }}
          // "adfasdf<br/>"
        ></p>
        <div className={styles.options__date}>
          <div className={styles.options}>
            {options.map((option, index) => (
              <a
                href={option.link}
                key={index}
                target="_blank"
                rel="noreferrer"
                className={styles.option}
              >
                {option.icon == "instagram" ? (
                  <InstagramIcon />
                ) : option.icon == "github" ? (
                  <GitHubIcon />
                ) : option.icon == "deploy" ? (
                  <LanguageRoundedIcon />
                ) : option.icon == "twitter" ? (
                  <TwitterIcon />
                ) : (
                  <ArchitectureRoundedIcon />
                )}
              </a>
            ))}
          </div>
          <div className={styles.date}>
            {timeAgo.format(Date.now() + nowDate.getTime() - date)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Project;
