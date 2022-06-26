import React from "react";

import SwiperCore, { Navigation, Keyboard, Autoplay } from "swiper";
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
  const { description, title, options, date, covers } = props.project;

  // get this moment time
  const nowDate = new Date();

  // https://www.npmjs.com/package/javascript-time-ago
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  const time = timeAgo.format(Date.now() + nowDate.getTime() - date);

  SwiperCore.use([Autoplay]);

  const generateRandom = (maxLimit = 8000, minLimit = 3000) => {
    // generate a floating number which is in range of 1 to 0
    // to so to make it between zero to our maximum limit multiply it to our maximum number.
    let randomNum = Math.random() * maxLimit;

    // but still it's floating, so floor method makes it integer number which is needed
    // however floating is cool but to for css processing.
    randomNum = Math.floor(randomNum);

    if (randomNum < minLimit) {
      return minLimit;
    }

    return randomNum;
  };

  return (
    <section className={styles.project}>
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={true}
        keyboard={true}
        modules={[Navigation, Keyboard]}
        className={styles.slider}
        loop={true}
        autoplay={{
          delay: generateRandom(7000, 4000),
          disableOnInteraction: true,
        }}
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
            {time[0].toLocaleUpperCase() + time.slice(1)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Project;
