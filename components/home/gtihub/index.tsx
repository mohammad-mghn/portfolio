import { styles } from "@/styles";
import React from "react";

function Github() {
  return (
    <>
      <section className="px-2 pb-3">
        <h1 className="text-secondary font-semibold text-2xl">My blog on Dev.to</h1>

        <div className="mt-3 ml-3">
          <div className="w-full flex items-center justify-between flex-wrap gap-x-2 gap-y-4">
            <h2 className="text-sm md:text-xl text-text opacity-80">
              Talk is cheap, Show me the code. <span className="text-darker-text text-xs">Linus Torvalds</span>
            </h2>

            <button className={`${styles.button} px-4 py-2 md:px-6 md:py-3 border-[3px] border-brand`}>
              Gtihub Page
            </button>
          </div>
        </div>
      </section>

      <div className={styles.divider} />
    </>
  );
}

export default Github;
