import React, { useState, useRef, useEffect } from "react";

import Header from "../../modules/head";
import LoadingPage from "../../components/loadingPage";
import TextButton from "../../elements/textButton";
import BlogPreview from "../../components/blogPreview";

import { AnimatePresence, motion } from "framer-motion";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import styles from "../../styles/blog.module.css";

const Variants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      DelayNode: 1,
    },
  },
};

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFiltered, setSelectedFiltered] = useState("All");
  const [filtered, setFiltered] = useState([]);
  const [data, setData] = useState([
    {
      _id: "234",
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing",
      previewImgSrc: "https://images2.imgbox.com/80/5e/IyiTC07X_o.png",
      previewText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing t, consectetur adipiscing elit. Phasellus aliquet nibh id iaculis pharetra. Maecenas at leo non ligula congue cursus. Integer rhoncus urna tellus, fermentum ultrices risus finibus quis. In non pretium metus, quis ornare nunc. Phasellus sollicitudin consequat enim, vel ullamcorper tellus laoreet a. Morbi eleifend dictum justo, vel blandit enim euismod quis. Duis auctor sapien at mauris iaculis, nec ultricies ipsum interdum. Aliquam eu est nec nibh tempus posuere eleifend sed ex. Donec quis magna sed felis elementum blandit nec quis sem. Maecenas eros neque, iaculis interdum lectus gravida, blandit dapibus quam. Donec vitae massa molestie, euismod tortor nec, aliquam magna. Donec imperdiet sit amet magna ut consectetur. Aenean varius, ligula nec ullamcorper volutpat, lorem dui consequat neque, eu porttitor felis ante ut est.",
      time: 2345234895792,
      date: "2020/2/20",
      viewsCount: 23,
      likesCount: 21,
      categories: ["all"],
      author: "Vito.mohagheghian",
      body: "<main className='blog_main'><h1>Lorem ipsum dolor sit amet, consectetur adipiscing</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing t, consectetur adipiscing elit. Phasellus aliquet nibh id iaculis pharetra. Maecenas at leo non ligula congue cursus. Integer rhoncus urna tellus, fermentum ultrices risus finibus quis. In non pretium metus, quis ornare nunc. Phasellus sollicitudin consequat enim, vel ullamcorper tellus laoreet a. Morbi eleifend dictum justo, vel blandit enim euismod quis. Duis auctor sapien at mauris iaculis, nec ultricies ipsum interdum. Aliquam eu est nec nibh tempus posuere eleifend sed ex. Donec quis magna sed felis elementum blandit nec quis sem. Maecenas eros neque, iaculis interdum lectus gravida, blandit dapibus quam. Donec vitae massa molestie, euismod tortor nec, aliquam magna. Donec imperdiet sit amet magna ut consectetur. Aenean varius, ligula nec ullamcorper volutpat, lorem dui consequat neque, eu porttitor felis ante ut est</p><img src='https://images2.imgbox.com/80/5e/IyiTC07X_o.png' alt='' /><p>Lorem ipsum dolor sit amet, consectetur adipiscing t, consectetur adipiscing elit. Phasellus aliquet nibh id iaculis pharetra. Maecenas at leo non ligula congue cursus. Integer rhoncus urna tellus, fermentum ultrices risus finibus quis. In non pretium metus, quis ornare nunc. Phasellus sollicitudin consequat enim, vel ullamcorper tellus laoreet a. Morbi eleifend dictum justo, vel blandit enim euismod quis. Duis auctor sapien at mauris iaculis, nec ultricies ipsum interdum. Aliquam eu est nec nibh tempus posuere eleifend sed ex. Donec quis magna sed felis elementum blandit nec quis sem. Maecenas eros neque, iaculis interdum lectus gravida, blandit dapibus quam. Donec vitae massa molestie, euismod tortor nec, aliquam magna. Donec imperdiet sit amet magna ut consectetur. Aenean varius, ligula nec ullamcorper volutpat, lorem dui consequat neque, eu porttitor felis ante ut est</p></main>",
      comments: [
        {
          name: "Vito",
          email: "vito.adfasd",
          time: "189374192834",
          replies: [
            {
              name: "Ali",
              email: "al.asdfasdf",
              repilies: [],
              time: "199374192834",
            },
          ],
        },
      ],
    },
  ]);

  const searchInput = useRef();

  const blogHandler = () => {
    if (localStorage.getItem("vito-portfolio-blogs") === null) {
      fetch("api/blogs")
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setData(JSON.parse(data).reverse());
          localStorage.setItem(
            "vito-portfolio-blogs",
            JSON.stringify(JSON.parse(data).reverse())
          );
        });
    } else {
      setLoading(false);
      setData(JSON.parse(localStorage.getItem("vito-portfolio-blogs")));
      console.log(JSON.parse(localStorage.getItem("vito-portfolio-blogs")))
    }
  };
  useEffect(() => {
    blogHandler();
  }, []);
  // 62b29f8eb50e575a1bd41787
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
  }, [selectedFiltered, data]);

  const fields = ["All", "Programming", "Web", "JS/React"];

  const fieldHandler = (field) => {
    setSelectedFiltered(field);
  };

  const searchHandler = () => {
    let searchFiltered = data.filter((item) => {
      if (item.title.includes(searchInput.current.value)) {
        return item;
      }
    });
    setFiltered(searchFiltered);
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
      <AnimatePresence>
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
            <div className={styles.search_container}>
              <input
                required
                type="text"
                className={styles.input}
                placeholder="Search a keyword"
                ref={searchInput}
                onChange={searchHandler}
              />
              <SearchRoundedIcon
                className={styles.search_field_icon}
                onClick={searchHandler}
              />
            </div>
          </section>
          <section className={styles.blogs}>
            {filtered.map((item) => (
              <motion.div
                key={item._id}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ amount: 0.15 }}
              >
                <motion.div variants={Variants}>
                  <BlogPreview blog={item} setLoading={setLoading} />
                </motion.div>
              </motion.div>
            ))}
          </section>
        </main>
      </AnimatePresence>
    </>
  );
};

export default Blog;

 
