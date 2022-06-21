import React from "react";

import Link from "next/link";

import Button from "../elements/button";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";

import styles from "../styles/blogPreview.module.css";

const BlogPreview = (props) => {
  const data = { ...props.blog };
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h2 className={styles.title}>{data.title}</h2>
        <p className={styles.preview_text}>
          {data.previewText.length > 850
            ? data.previewText.slice(0, 850) + "..."
            : data.previewText}
        </p>
        <div className={styles.readmore__details}>
          <Button
            text="Read more"
            href={`blog/${data.title.replaceAll(" ", "-")}`}
            containerClassName={styles.button_container}
            scrollerClassName={styles.button_scroller}
          />
          <div className={styles.options}>
            <div className={styles.option_container}>
              <RemoveRedEyeOutlinedIcon className={styles.icon} />
              <h3 className={styles.option_header}>{data.viewsCount}</h3>
            </div>
            <div className={styles.option_container}>
              <FavoriteBorderRoundedIcon className={styles.icon} />
              <h3 className={styles.option_header}>{data.likesCount}</h3>
            </div>
            <div className={styles.option_container}>
              <ChatBubbleOutlineRoundedIcon className={styles.icon} />
              <h3 className={styles.option_header}>{data.comments.length}</h3>
            </div>
            <div className={styles.option_container}>
              <EventNoteRoundedIcon className={styles.icon} />
              <h3 className={styles.option_header}>{data.viewsCount}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.preview_image_container}>
        <img
          src={data.previewImgSrc}
          alt={data.title}
          className={styles.preview_image}
        />
      </div>
    </div>
  );
};

export default BlogPreview;
