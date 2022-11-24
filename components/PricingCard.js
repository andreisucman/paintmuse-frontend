import { useState, useEffect } from "react";
import styles from "../styles/components/PricingCard.module.scss";

export default function PricingCard({ data }) {
  const [showSubtitleInfo, setShowSubtitleInfo] = useState(false);
  const [showLicenseInfo, setShowLicenseInfo] = useState(false);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const [price, setPrice] = useState("");
  const [pricePerImage, setPricePerImage] = useState("");

  function calculatePrice() {
    if (data.price) {
      if (data.card_type === "monthly_subscription") {
        setPrice(`$${data.price} /month`);
      } else {
        setPrice(`$${data.price} /year`);
      }
    } else {
      setPrice(`varying`);
    }
  }

  function calculatePricePerImage() {
    if (data.pricePerImage) {
      setPricePerImage(data.pricePerImage);
    } else {
      setPricePerImage(`${(data.price / data.quota).toFixed(2)}`);
    }
  }

  useEffect(() => {
    calculatePrice();
    calculatePricePerImage();
  }, []);

  function handleShowSubtitleInfo() {
    setShowSubtitleInfo(true);

    setTimeout(() => {
      setShowSubtitleInfo(false);
    }, 5000);
  }

  function handleShowLicenseInfo() {
    setShowLicenseInfo(true);

    setTimeout(() => {
      setShowLicenseInfo(false);
    }, 4000);
  }

  function handleShowPrivacyInfo() {
    setShowPrivacyInfo(true);

    setTimeout(() => {
      setShowPrivacyInfo(false);
    }, 4000);
  }

  return (
    <div className={styles.card}>
      <div className={styles.card__wrapper}>
        <h3 className={styles.card__title}>{data.title}</h3>
        <div className={styles.card__subtitle}>
          Images per{" "}
          {data.card_type === "annual_subscription" ? "year" : "month"}
          <div
            className={styles.card__subtitle_info_icon}
            onClick={handleShowSubtitleInfo}
          ></div>
          {showSubtitleInfo && (
            <div className={styles.card__subtitle_info}>
              <div
                className={styles.card__subtitle_info_close}
                onClick={() => setShowSubtitleInfo(false)}
              ></div>
              {data.subtitle_info}
            </div>
          )}
        </div>
        <div className={styles.card__quota_div}>
          <p className={styles.card__quota}>
            {data.quota ? data.quota : "flexible"}
          </p>
        </div>
        <p className={styles.card__price_div}>
          <span className={styles.card__price}>{price}</span>
        </p>
        <p>Price per Image ${pricePerImage}</p>
        <div className={styles.card__privacy_div}>
          Privacy:
          <label
            htmlFor="privacy"
            className={
              data.privacy === "Public"
                ? `${styles.card__privacy_label} ${styles.card__privacy_label_highlight}`
                : styles.card__privacy_label
            }
          >
            {" "}
            {data.privacy}
            <input
              className={styles.card__privacy_input}
              id="privacy"
              type="radio"
            />
          </label>
          <div
            className={styles.card__privacy_info_icon}
            onClick={handleShowPrivacyInfo}
          ></div>
          {showPrivacyInfo && (
            <div className={styles.card__privacy_info}>
              {data.privacy_message}
              <div
                className={styles.card__privacy_info_close}
                onClick={() => setShowPrivacyInfo(false)}
              ></div>
            </div>
          )}
        </div>
        <div className={styles.card__license_div}>
          License:
          <label htmlFor="license" className={styles.card__license_label}>
            {" "}
            Extended
            <input
              className={styles.card__license_input}
              id="license"
              type="radio"
            />
          </label>
          <div
            className={styles.card__license_info_icon}
            onClick={handleShowLicenseInfo}
          ></div>
          {showLicenseInfo && (
            <div className={styles.card__license_info}>
              You have full commercial rights on the art you generate.
              <div
                className={styles.card__license_info_close}
                onClick={() => setShowLicenseInfo(false)}
              ></div>
            </div>
          )}
        </div>

        <button className={styles.card__button}>Get started</button>
      </div>
    </div>
  );
}