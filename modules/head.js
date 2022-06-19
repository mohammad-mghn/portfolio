import React from "react";

import Head from "next/head";

const Header = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="../V-icon.svg" />
    </Head>
  );
};

export default Header;
