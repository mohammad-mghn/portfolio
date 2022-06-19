import React from "react";

import Rate from "../elements/rate";

import { motion } from "framer-motion";

import styles from "../styles/about.module.css";

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

const RatesSection = ({ rates, title }) => {
  return (
    <>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        exit="exit"
        viewport={{ amount: 0.3 }}
      >
        <section>
          <h4 className={styles.sections_header}>{title}45674</h4>
          <div className={styles.rates}>
            <div style={{ width: "100%" }}>
              {rates.leftSide.map((item, index) => (
                <motion.div className="card" variants={Variants} key={index}>
                  <Rate title={item.title} rate={item.rate} />
                </motion.div>
              ))}
            </div>
            <div className={styles.horizantal_line}></div>
            <div style={{ width: "100%" }}>
              <motion.div className="card" variants={Variants}>
                {rates.rightSide.map((item, index) => (
                  <Rate title={item.title} rate={item.rate} key={index} />
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </motion.div>
      <div className={styles.vertical_line}></div>
    </>
  );
};

export default RatesSection;
