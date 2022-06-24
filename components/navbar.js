import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { Context } from "../modules/Context";
import ContextToggle from "../modules/contextToggle";

import { CSSTransition } from "react-transition-group";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import styles from "../styles/navbar.module.css";

import VIcon from "../public/V-icon.svg";

function Navbar() {
  const router = useRouter();

  var pathname = router.asPath;

  const [showNavbar, setShowNavbar] = useState(false);

  React.useEffect(() => {
    // this will give us pageYOffset when component mounted
    var prevScrollpos = window.pageYOffset;

    function onScroll() {
      window.onscroll = function () {
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos >= currentScrollPos) {
          // certainly this could be coded by useState
          // but this one is more optimzed.
          document.getElementById("navbar").style.top = "1rem";
          // top 1rem is regular navbar top property so it makes  it visiable.
        } else {
          document.getElementById("navbar").style.top = "-4.5rem";
        }
        // then preScrollpos will update to current page Y offset
        // to become ready for next scroll eventListner.
        prevScrollpos = currentScrollPos;
      };
    }
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  const menu = [
    { header: "Home", path: "/" },
    { header: "About", path: "/about" },
    { header: "Contact", path: "/contact" },
    { header: "Projects", path: "/projects" },
    { header: "blog", path: "/blog" },
  ];

  return (
    <Context.Consumer>
      {(context) => {
        return (
          <header className={styles.header}>
            <nav id="navbar" className={styles.navbar}>
              <div className={styles.icon_and_menu}>
                <button className={styles.v_icon_container}>
                  <Link href={"/"}>
                    <Image
                      src={VIcon}
                      alt="vito mohagheghian logo"
                      height={110}
                      width={150}
                    />
                  </Link>
                </button>
                <button
                  className={styles.menu_icon_container}
                  onClick={() => {
                    setShowNavbar(true);
                  }}
                >
                  <MenuRoundedIcon className={styles.menu_icon} />
                </button>
              </div>
              <div className={styles.desktop_menu_container}>
                <ul className={styles.links}>
                  {menu.map((item, index) => (
                    <Link href={item.path} key={index}>
                      <a
                        className={
                          pathname === item.path
                            ? `${styles.link_text} ${styles.link_text_clicked}`
                            : styles.link_text
                        }
                      >
                        {item.header}
                      </a>
                    </Link>
                  ))}
                </ul>

                <div className={styles.contextToggler}>
                  <ContextToggle />
                </div>
              </div>
            </nav>

            <CSSTransition
              in={showNavbar}
              timeout={300}
              // navbar classNames are in styles/global.css
              classNames="navbar"
              unmountOnExit
            >
              <>
                <div className={styles.mobile_menu_container}>
                  <button
                    className={styles.close_button_container}
                    onClick={() => {
                      setShowNavbar(false);
                    }}
                  >
                    <CloseRoundedIcon className={styles.close_button} />
                  </button>
                  <ul className={styles.links}>
                    {menu.map((item, index) => (
                      <Link href={item.path} key={index}>
                        <a
                          className={
                            pathname === item.path
                              ? `${styles.link_text} ${styles.link_text_clicked}`
                              : styles.link_text
                          }
                        >
                          {item.header}
                        </a>
                      </Link>
                    ))}
                  </ul>
                  <div className={styles.mobile_contextToggler}>
                    <ContextToggle />
                  </div>
                </div>
                <button
                  className={styles.mobile_navbar_handler}
                  onClick={() => {
                    setShowNavbar(false);
                  }}
                ></button>
              </>
            </CSSTransition>
          </header>
        );
      }}
    </Context.Consumer>
  );
}

export default Navbar;
