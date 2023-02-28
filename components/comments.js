import React from "react";

import Comment from "./comment";

const Comments = ({ comments, id }) => {
  return (
    <>
      {comments.map((item, index) => {
        return (
          <Comment
            id={id}
            reply={item}
            index={index}
            comments={comments}
            key={id}
          />
        );
      })}
    </>
  );
};

export default Comments;
