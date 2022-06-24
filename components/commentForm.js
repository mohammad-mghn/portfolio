import React, { useRef } from "react";

import styles from "../styles/form.module.css";

const CommentForm = ({ comments, id, setComments, forceUpdate }) => {
  const form = useRef();

  const commentHandler = () => {
    const date = new Date();

    function Comment(name, email, body, time) {
      this.name = name;
      this.email = email;
      this.time = time;
      this.body = body;
      this.replies = [];
    }

    const newComment = new Comment(
      form.current[1].value,
      form.current[2].value,
      form.current[0].value,
      date.getTime()
    );

    const AllComments = comments;

    AllComments.push(newComment);

    fetch("/api/updateCommentsBlog", {
      method: "POST",
      body: JSON.stringify({
        _id: id,
        comments: AllComments,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    setComments(AllComments);

    forceUpdate();

    form.current[0].value = "";
    form.current[1].value = "";
    form.current[2].value = "";
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h5 className={styles.heading}>Leave your Comment</h5>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className={styles.form}
        ref={form}
      >
        <textarea className={styles.textarea} placeholder="Comment"></textarea>
        <span className={styles.input_container}>
          <input type="text" className={styles.input} placeholder="Name" />
          <input type="email" className={styles.input} placeholder="Email" />
          <button
            className={styles.button}
            onClick={() => {
              commentHandler();
            }}
          >
            Done
          </button>
        </span>
      </form>
    </div>
  );
};

export default CommentForm;
