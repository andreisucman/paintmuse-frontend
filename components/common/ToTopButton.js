import { useState, useEffect }  from "react";
import styles from "../../styles/components/common/ToTopButton.module.scss";

export default function ToTopButton() {
  const [showButton, setShowButton] = useState(false);
  const [header, setHeader] = useState(null);

  useEffect(() => {
    setHeader(document.getElementById("header"));
    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {
      if (header.getBoundingClientRect().top < 0) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  return (
    <div
      className={
        showButton
          ? `${styles.container} ${styles.container_visible}`
          : styles.container
      }
    >
      <div className={styles.container__button} onClick={() => header.scrollIntoView({ behavior: "smooth" })}>
      </div>
    </div>
  );
}
