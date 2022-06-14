import React from "react";

import { useRouter } from "next/router";

import ContextProvider, { Context } from "../components/Context";
import { GlobalStyles } from "../components/globalStyles";
import { lightTheme, darkTheme } from "../components/theme";

import Navbar from "../components/navbar";

import LoadingPage from "../components/loadingPage";

import { ThemeProvider } from "styled-components";
import { PageTransition } from "next-page-transitions";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [loadingPage, setLoadingPage] = React.useState(true);

  const router = useRouter();

  React.useEffect(() => {
    setLoadingPage(false);
    router.events.on("routeChangeStart", () => setLoadingPage(true));
    router.events.on("routeChangeComplete", () => setLoadingPage(false));
  });

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
                  overflow: "hidden",
                }}
              >
                {/* pageTransition related styles is in styles/global.css */}
                <PageTransition timeout={500} classNames="page-transition">
                  <>
                    <LoadingPage visibility={loadingPage} />
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
