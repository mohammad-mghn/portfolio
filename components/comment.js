import React, { useState } from "react";

import Image from "next/image";

import ReplyForm from "../components/replyForm";
import Reply from "./reply";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import Avatar from "../public/man_avatar.svg";

import styles from "../styles/comment.module.css";

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

const Comment = ({ reply, id, index, comments }) => {
  const forceUpdate = useForceUpdate();

  const [replyForm, setReplyForm] = useState(false);
  const [replies, setReplies] = useState(reply.replies);

  const nowDate = new Date();
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  const time = timeAgo.format(Date.now() + nowDate.getTime() - reply.time);

  if (reply) {
    return (
      <>
        <div className={styles.container}>
          <div className={styles.avatar__name_container}>
            <img src={Avatar.src} alt="avatar" className={styles.avatar} />
            <div className={styles.name__time__container}>
              <h6 className={styles.name_heading}>{reply.name.slice(0, 15)}</h6>
              <h6 className={styles.time_heading}>
                {time[0].toLocaleUpperCase() + time.slice(1)}
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
        <div className={styles.reply}>
          {replies &&
            replies.map((item) => {
              return (
                <>
                  <Reply
                    reply={item}
                    key={item.name}
                    setReplyForm={setReplyForm}
                  />
                </>
              );
            })}
        </div>
        <div className={styles.reply_form}>
          {replyForm && (
            <ReplyForm
              id={id}
              comments={comments}
              CommentIndex={index}
              setComments={setReplies}
              forceUpdate={forceUpdate}
              setReplyForm={setReplyForm}
            />
          )}
        </div>
      </>
    );
  }
};

export default Comment;
