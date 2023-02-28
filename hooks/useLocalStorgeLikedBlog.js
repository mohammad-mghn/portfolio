import React, { useState, useEffect } from "react";

const UseLocalStorgeLikedBlog = (blogId, likesCounts) => {
  // initial value is false saticlly because useEffect hook we'll set the default value
  const [liked, setLiked] = useState(false);

  const [likesCount, setLikesCount] = useState(likesCounts);

  useEffect(() => {
    // get localStorge liked blogs
    const likedLocalStorgeArray = JSON.parse(
      localStorage.getItem("vito-portfolio-liked")
    );

    // check if liked blogs is definded or not
    if (likedLocalStorgeArray !== null) {
      // if blog is definded in liked blogs set like icon filled
      if (likedLocalStorgeArray.includes(blogId)) {
        setLiked(true);
      }
    } else {
      // defind liked blogs
      localStorage.setItem("vito-portfolio-liked", JSON.stringify([]));
    }
  }, [blogId]);

  const likeHandler = () => {
    let likedCached = [];

    if (liked) {
      // to remove هntended id we need its index
      const likedCachedRemovedIndex = likedCached.indexOf(blogId);

      for (let i = 0; i < likedCached.length; i++) {
        if (likedCached[i] === likedCachedRemovedIndex) {
          likedCached.slice(i, 1);
          i--;
        }
      }

      // update localstorge
      localStorage.setItem("vito-portfolio-liked", JSON.stringify(likedCached));

      // decrease likes count
      setLikesCount((prevValue) => (prevValue -= 1));

      setLiked(false);
    } else {
      likedCached = JSON.parse(localStorage.getItem("vito-portfolio-liked"));

      // add blog's id to liked blogs array
      likedCached.push(blogId);

      // update localStorge
      localStorage.setItem("vito-portfolio-liked", JSON.stringify(likedCached));

      // increase likes Count
      setLikesCount((prevValue) => (prevValue += 1));

      setLiked(true);
    }
  };

  return [liked, likeHandler, likesCount];
};

export default UseLocalStorgeLikedBlog;
