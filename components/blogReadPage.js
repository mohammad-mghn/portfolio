import React, { useState } from "react";

import Comments from "./comments";
import CommentForm from "./commentForm";
import UseLocalStorgeLikedBlog from "../hooks/useLocalStorgeLikedBlog";

import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CopyrightRoundedIcon from "@mui/icons-material/CopyrightRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";

import styles from "../styles/blogPage.module.css";

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

const BlogReadPage = ({ blog }) => {
  const forceUpdate = useForceUpdate();

  const [commentsState, setComments] = useState(blog.comments);

  const [liked, likeHandler, likesCount] = UseLocalStorgeLikedBlog(
    blog._id,
    blog.likesCount
  );

  const likeStatusHandler = (operator) => {
    likeHandler();

    fetch("/api/updateBlog", {
      method: "POST",
      body: JSON.stringify({
        _id: blog._id,
        likesCount: (likesCount += operator),
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
  };

  return (
    <>
      <section className={styles.main}>
        <section className={styles.header}>
          <h1 className={styles.title} sty>
            {blog.title}
          </h1>

          <img
            alt=""
            src={blog.previewImgSrc}
            className={styles.preview_image}
          />
        </section>

        <section className={styles.details}>
          <div className={styles.detail}>
            <EventNoteRoundedIcon className={styles.detail_icon} />
            <h3 className={styles.detail_value}>{blog.date}</h3>
          </div>
          <div className={styles.detail}>
            <ChatBubbleOutlineRoundedIcon className={styles.detail_icon} />
            <h3 className={styles.detail_value}>{commentsState.length}</h3>
          </div>
          <div className={styles.detail}>
            <CopyrightRoundedIcon className={styles.detail_icon} />
            <h3 className={styles.detail_value}>{blog.body.length}</h3>
          </div>
          <div className={styles.detail}>
            <PermIdentityRoundedIcon className={styles.detail_icon} />
            <h3 className={styles.detail_value}>{blog.author}</h3>
          </div>

          <div className={styles.detail}>
            <CategoryOutlinedIcon className={styles.detail_icon} />
            <h3 className={styles.detail_value}>
              {blog.categories.map((category, index) =>
                index + 1 === blog.categories.length
                  ? category + " "
                  : category + " & "
              )}
            </h3>
          </div>

          <div className={`${styles.detail} ${styles.favorite_detail}`}>
            {liked ? (
              <FavoriteRoundedIcon
                className={`${styles.detail_icon} ${styles.favorite_detail_icon}`}
                onClick={() => {
                  likeStatusHandler(-1);
                }}
              />
            ) : (
              <FavoriteBorderRoundedIcon
                className={`${styles.detail_icon} ${styles.favorite_detail_icon}`}
                onClick={() => {
                  likeStatusHandler(1);
                }}
              />
            )}
            <h3 className={styles.detail_value}>{likesCount}</h3>
          </div>
        </section>

        <article
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: blog.body }}
        ></article>
      </section>

      <section className={styles.comments}>
        <div className={styles.comments_header}>
          <h5 className={styles.comments_heading}>Comments</h5>
          <div className={styles.comments_count__icon}>
            <ChatBubbleOutlineRoundedIcon className={styles.comments_icon} />
            <h6 className={styles.comments_count}>{commentsState.length}</h6>
          </div>
        </div>

        <Comments comments={commentsState} id={blog._id} />

        <div className={styles.comments_form}>
          <CommentForm
            id={blog._id}
            comments={commentsState}
            setComments={setComments}
            forceUpdate={forceUpdate}
          />
        </div>
      </section>
    </>
  );
};

export default BlogReadPage;
