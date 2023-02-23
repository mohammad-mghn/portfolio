import React from "react";

import Chart from "./chart";

import { ChartType } from "@/types/chart";

import { styles } from "@/styles";

type Props = {
  header: string;
  data: ChartType[];
};

function ChartSection({ header, data }: Props) {
  // As an example [1,2,3,4,5] this variable will return 3 it means first three items should be in leftSide
  const halfIndex = Math.round(data.length / 2);

  // due to higher example [1,2,3]
  const leftColumn = data.splice(0, halfIndex);
  // due to higher example [4,5]
  const rightColumn = data.splice(0, halfIndex + 1);

  return (
    <>
      <section className="px-2">
        <h1 className="text-secondary font-semibold text-2xl">{header}</h1>

        <div className="mt-3 ml-3 flex justify-between flex-col md:flex-row space-y-4 md:space-y-0">
          <div className="space-y-4 flex-1">
            {leftColumn.map((item, index) => (
              <Chart item={item} key={index} />
            ))}
          </div>

          <div className="hidden md:block mx-5 w-1 bg-border rounded-lg" />

          <div className="space-y-4 flex-1">
            {rightColumn.map((item, index) => (
              <Chart item={item} key={index} />
            ))}
          </div>
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default ChartSection;
