import React from "react";

import Head from "next/head";

const Header = (props) => {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <link rel="icon" href="../V-icon.svg" />
    </Head>
  );
};

export default Header;
