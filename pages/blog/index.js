import React, { useState, useRef, useEffect } from "react";

import Header from "../../modules/head";
import LoadingPage from "../../components/loadingPage";
import TextButton from "../../elements/textButton";

import 

import styles from "../../styles/blog.module.css";

const Blog = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFiltered, setSelectedFiltered] = useState("all");
  const [filtered, setFiltered] = useState([]);
  const [data, setData] = useState([
    {
      title: "title",
      previewImgSrc: "",
      time: "",
      date: "",
      viewsCount: "",
      likesCount: "",
      categories: ["all"],
      author: "",
      body: "",
      comments: [
        {
          name: "",
          email: "",
          replies: [{ name: "", email: "", repilies: [] }],
        },
      ],
    },
    {
      title: "title",
      previewImgSrc: "",
      time: "",
      date: "",
      viewsCount: "",
      likesCount: "",
      categories: ["all", "programming"],
      author: "",
      body: "",
      comments: [
        {
          name: "",
          email: "",
          replies: [{ name: "", email: "", repilies: [] }],
        },
      ],
    },
  ]);

  const searchInput = useRef();

  useEffect(() => {
    switch (selectedFiltered) {
      case "Programming":
        const programmingBlogs = data.filter((item) => {
          if (item.categories.includes("programming")) return item;
        });
        setFiltered(programmingBlogs);
        break;
      case "Web":
        const webBlogs = data.filter((item) => {
          if (item.categories.includes("web")) return item;
        });
        setFiltered(webBlogs);
        break;
      case "JS/React":
        const jsBlogs = data.filter((item) => {
          if (item.categories.includes("web")) return item;
        });
        setFiltered(jsBlogs);
        break;
      default:
        setFiltered(data);
        console.log("A");
        break;
    }
    console.log(data);
  }, [selectedFiltered, data]);

  const fields = ["All", "Programming", "Web", "JS/React"];

  const fieldHandler = (field) => {
    setSelectedFiltered(field);
  };

  return (
    <>
      <Header
        title={"Vito Mohagheghian • Blog"}
        description={
          "vito mohagheghian blog os about tech, programming, and Javascript. blogs are writen with Farsi and English"
        }
      />
      <LoadingPage visibility={loading} />
      <main className={styles.container}>
        <section className={styles.filter_section}>
          <div className={styles.field_filter_container}>
            {fields.map((field) => (
              <TextButton
                text={field}
                className={styles.filter_button}
                onClick={() => {
                  fieldHandler(field);
                }}
                key={field}
              />
            ))}
          </div>
          <div className={styles.search_container}>
            <input type="text" />
          </div>
        </section>
      </main>
    </>
  );
};

export default Blog;
