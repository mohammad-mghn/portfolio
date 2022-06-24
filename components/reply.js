import React from "react";

import Image from "next/image";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import Avatar from "../public/man_avatar.svg";

import styles from "../styles/comment.module.css";

const Reply = ({ reply, setReplyForm }) => {
  const nowDate = new Date();
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  if (reply) {
    return (
      <>
        <div className={styles.container}>
          <div className={styles.avatar__name_container}>
            <img src={Avatar.src} alt="avatar" className={styles.avatar} />
            <div className={styles.name__time__container}>
              <h6 className={styles.name_heading}>
                {reply.name.slice(0, 20)}
                {reply.name.length > 20 ? "..." : ""}
              </h6>
              <h6 className={styles.time_heading}>
                {timeAgo.format(Date.now() + nowDate.getTime() - reply.time)}
              </h6>
            </div>
            <button
              className={styles.reply_button}
              onClick={() => {
                setReplyForm(true);
              }}
            >
              Reply
            </button>
          </div>
          <div className={styles.body}>{reply.body}</div>
        </div>
      </>
    );
  }
};

export default Reply;
