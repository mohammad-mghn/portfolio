import React, { useState, useEffect } from "react";

import Header from "../modules/head";
import LoadingPage from "../components/loadingPage";
import Project from "../components/project";

import { AnimatePresence, motion } from "framer-motion";

import styles from "../styles/projects.module.css";

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

function Projects() {
  const [Loading, setLoading] = useState(true);
  const [Data, setData] = useState([
    {
      covers: [""],
      description: ``,
      title: "",
      options: [
        {
          link: "",
          icon: "",
        },
      ],
      date: 0,
    },
  ]);

  const addposthandler = () => {
    if (localStorage.getItem("vito-portfolio-projects") === null) {
      fetch("api/projectsPage")
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setData(JSON.parse(data).reverse());
          localStorage.setItem(
            "vito-portfolio-projects",
            JSON.stringify(JSON.parse(data).reverse())
          );
        });
    } else {
      setLoading(false);
      setData(JSON.parse(localStorage.getItem("vito-portfolio-projects")));
    }
  };

  useEffect(() => {
    addposthandler();
  }, []);
  return (
    <>
      <Header
        title="Vito Mohagheghian"
        description={"vito mohagheghian's projects"}
      />
      <LoadingPage visibility={Loading} />
      <AnimatePresence>
        <main className={styles.container}>
          {Data.map((project, index) => (
            <motion.div
              key={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ amount: 0.25 }}
            >
              <motion.div variants={Variants}>
                <Project project={project} />
              </motion.div>
            </motion.div>
          ))}
        </main>
      </AnimatePresence>
    </>
  );
}

export default Projects;
