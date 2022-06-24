import React, { useEffect } from "react";

import { useRouter } from "next/router";

import ContextProvider, { Context } from "../modules/Context";
import { GlobalStyles } from "../modules/globalStyles";
import { lightTheme, darkTheme } from "../modules/theme";

import Navbar from "../components/navbar";
import OneMin from "../components/oneMin";
import LoadingPage from "../components/loadingPage";

import { ThemeProvider } from "styled-components";
import { PageTransition } from "next-page-transitions";
import { AnimatePresence } from "framer-motion";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [loadingPage, setLoadingPage] = React.useState(true);
  const [oneMin, setOneMin] = React.useState(false);

  const router = useRouter();

  useEffect(() => {
    setLoadingPage(false);
    router.events.on("routeChangeStart", () => setLoadingPage(true));
    router.events.on("routeChangeComplete", () => setLoadingPage(false));
  });

  useEffect(() => {
    if (localStorage.getItem("vito-portfolio-onemin") === null) {
      setTimeout(() => {
        setOneMin(true);
      }, 60000);
      localStorage.setItem("vito-portfolio-onemin", JSON.stringify(true));
    }
    return () => {
      localStorage.removeItem("vito-portfolio-about");
      localStorage.removeItem("vito-portfolio-projects");
      localStorage.removeItem("vito-portfolio-blogs");
    };
  }, []);
  return (
    <ContextProvider>
      <Context.Consumer>
        {(context) => {
          return (
            <ThemeProvider theme={context.isLight ? lightTheme : darkTheme}>
              <GlobalStyles />
              <Navbar />
              {/* hidden overflow is for type of page transition 
              to unable vertical scrollbar during animation */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* pageTransition related styles is in styles/global.css */}
                <PageTransition timeout={500} classNames="page-transition">
                  <>
                    <LoadingPage visibility={loadingPage} />
                    <OneMin OneMin={oneMin} setOneMin={setOneMin} />
                    <Component {...pageProps} key={router.asPath} />
                  </>
                </PageTransition>
              </div>
            </ThemeProvider>
          );
        }}
      </Context.Consumer>
    </ContextProvider>
  );
}

export default MyApp;
