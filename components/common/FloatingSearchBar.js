import { useState, useEffect } from "react";
import styles from "../../styles/components/common/FloatingSearchBar.module.scss";
import SearchFieldDB from "../common/SearchFieldDB";

export default function FloatingSearchBar({ galleryImages, setGalleryImages, setSelectedImage, page, setPage }) {
  const [showBar, setShowBar] = useState(false);
  const [manuallyClosed, setManuallyClosed] = useState(false);

  useEffect(() => {
    const element = document.getElementById("generated_before_image_container");

    function listenToScroll() {
      window.addEventListener("scroll", () => {
        if (element.getBoundingClientRect().top < 0 && !manuallyClosed) {
          setShowBar(true);
        } else {
          setShowBar(false);
        }
      });
    }

    if (manuallyClosed) {
      setShowBar(false);
    }

    listenToScroll();

    return listenToScroll();
  }, [manuallyClosed]);

  return (
    <div
      className={
        showBar
          ? `${styles.container} ${styles.container_visible}`
          : styles.container
      }
    >
      <div className={styles.container__wrapper}>
        <SearchFieldDB
          text={"Search"}
          filterField={true}
          galleryImages={galleryImages}
          setGalleryImages={setGalleryImages}
          setSelectedImage={setSelectedImage}
          page={page}
          setPage={setPage}
          customerId={null}
        />
        <div
          className={styles.container__close}
          onClick={() => setManuallyClosed(true)}
        ></div>
      </div>
    </div>
  );
}
