"use client";

import React from "react";

type Props = {
  content: string[];
  Typingspeed: number;
  deletingSpeed: number;
  deletePauseTime: number;
  typePauseTime: number;
  containerClassName?: string;
  PrimaryTextClassName?: string;
  typingClassName?: string;
  cursorClassName?: string;
};

const TypingAnimation = (props: Props) => {
  const {
    content,
    Typingspeed,
    deletingSpeed,
    deletePauseTime,
    typePauseTime,
    containerClassName,
    PrimaryTextClassName,
    typingClassName,
    cursorClassName,
  } = props;
  React.useEffect(() => {
    // Current sentence being processed
    var part = 0;

    // Character number of the current sentence being processed
    var partIndex = 0;

    // Holds the handle returned from setInterval
    var interval: any;

    // Element that holds the text
    var element = document.querySelector("#typingElement");

    // Cursor element
    var cursorElement = document.querySelector("#cursor");

    // Implements typing effect
    function Type() {
      // Get substring with 1 characater added
      var text = content[part].substring(0, partIndex + 1);
      element!.innerHTML = text;
      partIndex++;

      // If full sentence has been displayed then start to delete the sentence after some time
      if (text === content[part]) {
        // Hide the cursor

        clearInterval(interval);
        setTimeout(function () {
          cursorElement!.className = "hidden";

          interval = setInterval(Delete, deletingSpeed);
        }, deletePauseTime);
      }
    }

    // Implements deleting effect
    function Delete() {
      // Get substring with 1 characater deleted
      var text = content[part].substring(0, partIndex - 1);
      element!.innerHTML = text;
      partIndex--;

      // If sentence has been deleted then start to display the next sentence
      if (text === "") {
        clearInterval(interval);

        // If current sentence was last then display the first one, else move to the next
        if (part == content.length - 1) part = 0;
        else part++;

        partIndex = 0;

        // Start to display the next sentence after some time
        setTimeout(function () {
          cursorElement!.className = "inline-block " + cursorClassName;
          interval = setInterval(Type, Typingspeed);
        }, typePauseTime);
      }
    }

    // Start the typing effect on load
    interval = setInterval(Type, Typingspeed);
  }, []);
  return (
    <div className={containerClassName} style={{ display: "flex", alignItems: "center", columnGap: ".25rem" }}>
      <div className={PrimaryTextClassName}>I&apos;m</div>
      <div className={typingClassName} id="typingElement"></div>
      <div className={cursorClassName} id="cursor">
        |
      </div>
    </div>
  );
};

export default TypingAnimation;
