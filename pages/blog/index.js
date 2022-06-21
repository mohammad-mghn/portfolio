import React, { useState, useRef, useEffect } from "react";

import Header from "../../modules/head";
import LoadingPage from "../../components/loadingPage";
import TextButton from "../../elements/textButton";
import BlogPreview from "../../components/blogPreview";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import styles from "../../styles/blog.module.css";

const Blog = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFiltered, setSelectedFiltered] = useState("All");
  const [filtered, setFiltered] = useState([]);
  const [data, setData] = useState([
    {
      _id: "234",
      title: "titleas asd asdf asdf ",
      previewImgSrc: "https://images2.imgbox.com/80/5e/IyiTC07X_o.png",
      previewText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing t, consectetur adipiscing elit. Phasellus aliquet nibh id iaculis pharetra. Maecenas at leo non ligula congue cursus. Integer rhoncus urna tellus, fermentum ultrices risus finibus quis. In non pretium metus, quis ornare nunc. Phasellus sollicitudin consequat enim, vel ullamcorper tellus laoreet a. Morbi eleifend dictum justo, vel blandit enim euismod quis. Duis auctor sapien at mauris iaculis, nec ultricies ipsum interdum. Aliquam eu est nec nibh tempus posuere eleifend sed ex. Donec quis magna sed felis elementum blandit nec quis sem. Maecenas eros neque, iaculis interdum lectus gravida, blandit dapibus quam. Donec vitae massa molestie, euismod tortor nec, aliquam magna. Donec imperdiet sit amet magna ut consectetur. Aenean varius, ligula nec ullamcorper volutpat, lorem dui consequat neque, eu porttitor felis ante ut est.",
      time: "",
      date: "2020/2/20",
      viewsCount: 23,
      likesCount: 21,
      categories: ["all"],
      author: "Vito.mohagheghian",
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
      _id: "2342",
      title: "title",
      previewImgSrc: "",
      previewText: "sdfgsdfg",
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
                style={{
                  color:
                    selectedFiltered === field
                      ? "var(--orangeColor)"
                      : "var(--paragraphColor)",
                }}
                onClick={() => {
                  fieldHandler(field);
                }}
                key={field}
              />
            ))}
          </div>
          <form className={styles.search_container}>
            <input
              required
              type="text"
              className={styles.input}
              placeholder="Search a keyword"
            />
            <SearchRoundedIcon
              className={styles.search_field_icon}
              onClick={() => {
                console.log("Af");
              }}
            />
          </form>
        </section>
        <section className={styles.blogs}>
          {filtered.map((item) => (
            <BlogPreview blog={item} key={item._id} />
          ))}
        </section>
      </main>
    </>
  );
};

export default Blog;
