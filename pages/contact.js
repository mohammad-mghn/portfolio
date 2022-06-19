import React, { useState, useRef } from "react";

import Header from "../modules/head";

import { Context } from "../modules/Context";

import emailjs from "emailjs-com";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import LandingImage from "../public/contact_landing_image.svg";
import LandingImageLight from "../public/contact_landing_image_light.svg";

import styles from "../styles/contact.module.css";

export default function Contact() {
  // for email status notifications
  const [Notification, setNotification] = useState(null);

  // for getting data from form tag
  const form = useRef();

  // for landing image links
  const links = [
    { link: "https://www.instagram.com/vito.mohagheghian/", name: "Instagram" },
    { link: "https://twitter.com/hereisvito", name: "Twitter" },
    { link: "https://github.com/vito-mohagheghian", name: "Github" },
    { link: "https://discord.gg/QKH9MGjM", name: "Discord" },
    { link: "https://www.linkedin.com/uas/login-submit", name: "Linkedin" },
  ];

  // form inputs
  const inputs = [
    { type: "text", name: "from_name" },
    { type: "text", name: "title" },
    { type: "email", name: "from_email" },
  ];

  const sendEmail = (e) => {
    e.preventDefault();
    if (
      form.current[0].value !== "" &&
      form.current[1].value !== "" &&
      form.current[2].value !== "" &&
      form.current[3].value !== ""
    ) {
      setNotification("Email sent successfully.");
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
              setNotification("Email sent successfully.");
            } else {
              setNotification("Sorry, Email didn't send turn on VPN");
            }
          },
          () => {
            setNotification("Sorry, Email didn't send turn on VPN");
          }
        );
    } else {
      setNotification("Please fill out all inputs.");
    }
  };

  return (
    <Context.Consumer>
      {(context) => {
        return (
          <>
            <div className={styles.container}>
              {Notification && (
                <div className={styles.notification}>
                  {Notification}
                  <CloseRoundedIcon
                    onClick={() => {
                      setNotification(null);
                    }}
                    className={styles.close_button}
                  />
                </div>
              )}

              <Header
                title="Vito Mohagheghian • Contact"
                description="Vito mohagheghian's contact page"
              />
              <section className={styles.cover}>
                <h2 className={styles.contact_me_header}>Contact me</h2>
                <p className={styles.contact_me_description}>
                  I’m interested in freelance opportunities – especially
                  ambitious or large projects. However, if you have other
                  request or question, don’t hesitate to use the form.
                </p>
                <div className={styles.email_container}>
                  <form className={styles.email_form} ref={form}>
                    {inputs.map((input, index) => (
                      <input
                        type={input.type}
                        placeholder="Name"
                        name={input.name}
                        className={styles.input}
                        key={index}
                      />
                    ))}

                    <textarea
                      placeholder="Text"
                      name="message"
                      className={styles.input}
                    />

                    <button
                      className={styles.send_email}
                      type="button"
                      onClick={sendEmail}
                    >
                      SEND
                    </button>
                  </form>
                </div>
              </section>
              <section className={styles.landing_image}>
                <img
                  src={
                    context.isLight ? LandingImageLight.src : LandingImage.src
                  }
                  className={styles.landing_cover}
                  alt="vito's mohagheghian portfolio contact page map"
                />
                {links.map((link, index) => (
                  <a
                    className={styles.landing_links}
                    href={link.link}
                    rel="noreferrer"
                    target="_blank"
                    key={index}
                  >
                    {link.name}
                  </a>
                ))}
                <a
                  className={styles.landing_links}
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(
                        "vito.mohagheghian@gmail.com"
                      );
                      setNotification("Email address copied to clipboard!");
                      setTimeout(() => {
                        setNotification(null);
                      }, 2000);
                    } catch {
                      window.open("mailto:vito.mohagheghian@gmail.com");
                    }
                  }}
                >
                  Email
                </a>
              </section>
            </div>
          </>
        );
      }}
    </Context.Consumer>
  );
}
