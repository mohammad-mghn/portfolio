import React from "react";
import ChartSection from "./section";

function Charts() {
  return (
    <>
      <ChartSection
        header="Skills"
        data={[
          { title: "1", value: 10 },
          { title: "2", value: 10 },
          { title: "3", value: 10 },
          { title: "4", value: 10 },
          { title: "5", value: 10 },
          { title: "6", value: 10 },
          { title: "7", value: 10 },
        ]}
      />

      <ChartSection
        header="Tools"
        data={[
          { title: "Python", value: 10 },
          { title: "gf", value: 10 },
          { title: "Python", value: 10 },
          { title: "fg", value: 10 },
          { title: "ggggg", value: 10 },
          { title: "fffff", value: 10 },
          { title: "aaaaaa", value: 10 },
        ]}
      />

      <ChartSection
        header="Languages"
        data={[
          { title: "Python", value: 10 },
          { title: "gf", value: 10 },
        ]}
      />
    </>
  );
}

export default Charts;
