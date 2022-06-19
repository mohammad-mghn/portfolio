import React, { useState } from "react";

import Header from "../modules/head";
import LoadingPage from "../components/loadingPage";

import styles from "../styles/projects.module.css";

function Projects() {
  const [Loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  return (
    <>
      <Header
        title="Vito Mohagheghian"
        description={"vito mohagheghian's projects "}
      />
      <LoadingPage visibility={Loading} />
      <main className={styles.container}></main>
    </>
  );
}

export default Projects;
