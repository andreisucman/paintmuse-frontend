import Parse from "parse";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.webp";
import { useGetMethods, useGetCurrentState } from "./ContextProvider";
import styles from "../../styles/components/common/Header.module.scss";
import { useIsLoggedIn } from "../../helpers/useCurrentUser";
import { useRouter } from "next/router";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const currentState = useGetCurrentState();
  const methods = useGetMethods();
  const menuRef = useRef();
  const burgerRef = useRef();
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(useIsLoggedIn());
  }, [router.pathname]);

  useEffect(() => {
    Parse.initialize(process.env.NEXT_PUBLIC_APP_ID);
    Parse.serverURL = process.env.NEXT_PUBLIC_SERVER_URL_PARSE;
  }, []);

  function toggleMenu() {
    setMenuOpen((prevValue) => !prevValue);
  }

  function handleActiveLink(url) {
    toggleMenu();
    methods.setActiveLink(url);
  }

  function handleLogOut() {
    Parse.User.logOut();
  }

  // close menu on click outside
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        menuRef.current !== null &&
        !menuRef.current.contains(e.target) &&
        !burgerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () =>
      document.removeEventListener("mousedown", checkIfClickedOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //close menu on scroll

  useEffect(() => {
    document.addEventListener("scroll", () => setMenuOpen(false));

    return () =>
      document.removeEventListener("scroll", () => setMenuOpen(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className={styles.container} id="header">
      <div className={styles.container__wrapper}>
        <Link href="/" className={styles.container__logo_link}>
          <Image
            className={styles.container__logo_image}
            src={logo}
            alt="paintmuse logo"
          />
        </Link>
        <div className={styles.container__navigation_wrapper}>
          <nav
            ref={menuRef}
            className={
              menuOpen
                ? `${styles.container__navigation} ${styles.container__navigation_open}`
                : styles.container__navigation
            }
          >
            <div className={styles.container__product_buttons}>
              <ul className={styles.container__product_buttons_list}>
                <li
                  className={
                    currentState.activeLink === "/"
                      ? `${styles.container__product_buttons_list_item} ${styles.active_list_item}`
                      : `${styles.container__product_buttons_list_item}`
                  }
                >
                  <Link
                    href="/"
                    className={styles.container__product_buttons_list_link}
                    onClick={() => handleActiveLink("/")}
                  >
                    Generate muses from words
                  </Link>
                </li>
                <li
                  className={
                    currentState.activeLink === "/edit-existing-art"
                      ? `${styles.container__product_buttons_list_item} ${styles.active_list_item}`
                      : `${styles.container__product_buttons_list_item}`
                  }
                >
                  <Link
                    href="/edit-existing-art"
                    onClick={() => handleActiveLink("/edit-existing-art")}
                    className={styles.container__product_buttons_list_link}
                  >
                    Edit existing art
                  </Link>
                </li>
                <li
                  className={
                    currentState.activeLink === "/variate-composition"
                      ? `${styles.container__product_buttons_list_item} ${styles.active_list_item}`
                      : `${styles.container__product_buttons_list_item}`
                  }
                >
                  <Link
                    href="/variate-composition"
                    onClick={() => handleActiveLink("/variate-composition")}
                    className={styles.container__product_buttons_list_link}
                  >
                    Variate composition
                  </Link>
                </li>
                <li
                  className={
                    currentState.activeLink === "/pricing"
                      ? `${styles.container__product_buttons_list_item} ${styles.active_list_item}`
                      : `${styles.container__product_buttons_list_item}`
                  }
                >
                  <Link
                    href="/pricing"
                    onClick={() => handleActiveLink("/pricing")}
                    className={styles.container__product_buttons_list_link}
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <>
            {isLoggedIn && router.pathname !== "/account" && (
              <Link
                href="/account"
                className={styles.container__account_icon}
              ></Link>
            )}
            {!isLoggedIn && (
              <div className={styles.container__login_button}>
                <Link href="/login">Log in</Link>
              </div>
            )}
            {isLoggedIn && router.pathname === "/account" && (
              <div
                className={styles.container__logout_button}
                onClick={handleLogOut}
              >
                <Link href="/">Log out</Link>
              </div>
            )}
          </>
          <div
            ref={burgerRef}
            className={styles.burger}
            onClick={() => toggleMenu()}
          >
            <div
              className={
                menuOpen
                  ? `${styles.burger__stick} ${styles.burger__stick_top} ${styles.burger__stick_top_open}`
                  : `${styles.burger__stick} ${styles.burger__stick_top}`
              }
            ></div>
            <div
              className={
                menuOpen
                  ? `${styles.burger__stick} ${styles.burger__stick_middle} ${styles.burger__stick_middle_open}`
                  : `${styles.burger__stick} ${styles.burger__stick_middle}`
              }
            ></div>
            <div
              className={
                menuOpen
                  ? `${styles.burger__stick} ${styles.burger__stick_bottom} ${styles.burger__stick_bottom_open}`
                  : `${styles.burger__stick} ${styles.burger__stick_bottom}`
              }
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
}
