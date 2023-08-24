"use client";

import emailjs from "emailjs-com";
import React, { useRef } from "react";

import Input from "./input";
import { localType } from "@/types";
import { styles } from "@/styles";

function Form({ local }: { local: localType["contact"]["form"] }) {
  // for getting data from form tag
  const form: any = useRef();

  const sendEmail = (e: any) => {
    e.preventDefault();
    if (
      form.current![0].value !== "" &&
      form.current![1].value !== "" &&
      form.current![2].value !== "" &&
      form.current![3].value !== ""
    ) {
      // setNotification("Email sent successfully.");
      emailjs
        .sendForm(
          "service_a0qmb0i",
          "template_ik1gq7f",
          form.current,
          "user_O2XZdT1Nlt7VuHJBaXWyF"
        )
        .then(
          (result) => {
            if (result.text === "OK") {
              form.current[1].value = "";
              form.current[3].value = "";
              // setNotification("Email sent successfully.");
            } else {
              // setNotification("Sorry, Email didn't send turn on VPN");
            }
          },
          () => {
            // setNotification("Sorry, Email didn't send turn on VPN");
          }
        );
    } else {
      // setNotification("Please fill out all inputs.");
    }
  };

  return (
    <form className="md:w-[26rem] flex flex-wrap gap-x-4 gap-y-2" ref={form}>
      <Input
        type="text"
        name="title"
        label={local.title.label}
        placeholder={local.title.place_holder}
      />
      <Input
        type="text"
        name="from_name"
        label={local.name.label}
        placeholder={local.name.place_holder}
      />
      <Input
        type="email"
        name="from_email"
        label={local.email.label}
        placeholder={local.name.place_holder}
      />
      <label htmlFor="text" className="block text-text">
        {local.body.label}
      </label>
      <textarea
        id="text"
        name="message"
        className="py-2 px-3 w-full min-h-[15rem] max-h-[30rem] text-md text-text placeholder:text-darker-text rounded-lg bg-[#3D3D3D40] outline-none"
        placeholder={local.body.place_holder}
      />
      <button
        title="Send"
        className={`mt-2 w-full py-3 flex justify-center ${styles.button}`}
        onClick={sendEmail}
      >
        {local.send}
      </button>
    </form>
  );
}

export default Form;
