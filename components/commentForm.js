import React, { useRef, useId } from "react";

import styles from "../styles/form.module.css";

const CommentForm = ({ comments, id, setComments, forceUpdate }) => {
  const form = useRef();

  const unId = useId();

  const commentHandler = () => {
    const date = new Date();

    function Comment(name, email, body, time) {
      this.name = name;
      this.email = email;
      this.time = time;
      this.body = body;
      this.replies = [];
    }

    if (
      "vito.mohagheghian".includes(
        form.current[1].value.toLowerCase().replace(" ", "") ||
          "vitomohagheghian".includes(
            form.current[1].value.toLocaleLowerCase().replace(" ", "")
          )
      )
    ) {
      var newComment = new Comment(
        unId,
        form.current[2].value,
        form.current[0].value,
        date.getTime()
      );
    } else {
      var newComment = new Comment(
        form.current[1].value,
        form.current[2].value,
        form.current[0].value,
        date.getTime()
      );
    }
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
          <input
            type="text"
            className={styles.input_name}
            placeholder="Name"
            aria-invalid="false"
            onChange={(e) => {
            
              if (e.target.value.replace(" ", "") !== "") {
                if (
                  "vito.mohagheghian".includes(
                    e.target.value.toLowerCase().replace(" ", "") ||
                      "vitomohagheghian".includes(
                        e.target.value.toLocaleLowerCase().replace(" ", "")
                      )
                  )
                ) {
                  form.current[1].setAttribute("aria-invalid", "true");
                } else {
                  form.current[1].setAttribute("aria-invalid", "false");
                }
              } else {
                form.current[1].setAttribute("aria-invalid", "false");
              }
            }}
          />
          <input type="email" className={styles.input} placeholder="Email" />

          <div
            className={styles.button}
            onClick={() => {
              commentHandler();
            }}
          >
            <span className={styles.scroller}></span>
            <div className={styles.button_txt}>Done</div>
          </div>
        </span>
      </form>
    </div>
  );
};

export default CommentForm;
