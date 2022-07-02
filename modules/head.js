import React from "react";

import Head from "next/head";

const Header = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="../V-icon.svg" />
      <meta name="google-site-verification" content="f114g5LtxUwJCf1-lhSX0UNVecMRh8RjSKMulnicBNI" />
    </Head>
  );
};

export default Header;
