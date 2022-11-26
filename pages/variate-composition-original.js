import axios from "axios";
import Parse from "parse";
import Link from "next/link";
import Image from "next/image";
import ReactLoading from "react-loading";
import { useState, useEffect } from "react";
import Buttons from "../components/common/Buttons";
import placeholder_original from "../public/assets/placeholder.svg";
import placeholder_variations from "../public/assets/placeholder_arrows.svg";
import {
  useGetMethods,
  useGetCurrentState,
} from "../components/common/ContextProvider";
import ErrorPopUp from "../components/common/ErrorPopUp";
import Counter from "../components/common/Counter";
import { uploadToClient } from "../helpers/uploadToClient";
import { useGetCurrentUser } from "../helpers/useCurrentUser";
import { fetchGalleryImages } from "../helpers/fetchGalleryImages";
import styles from "../styles/VariateComposition.module.scss";

export default function VariateComposition() {
  const { setActiveLink } = useGetMethods();
  const [editedImages, setEditedImages] = useState([
    placeholder_variations,
    placeholder_variations,
    placeholder_variations,
  ]);
  const [readyToDownload, setReadyToDownload] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const { imageCount, isLoading, isError } = useGetCurrentState();
  const { setIsLoading, setIsError } = useGetMethods();
  const currentUser = useGetCurrentUser();
  const [subscribed, setSubscribed] = useState(false);

  async function requestVariation() {
    if (!currentUser) return;
    if (!originalImage) return;

    try {
      setIsLoading(true);

      const parseOriginal = new Parse.File("original", originalImage);
      await parseOriginal.save();

      const params = {
        original: parseOriginal.url(),
        count: imageCount,
        customerId: currentUser.customerId,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/requestVariation`, params, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      setIsLoading(false);
      setIsError(
        Object.assign({}, isError, {
          value: true,
          message: `Make sure your image is pixel-perfect square and has 1024x1024 resolution at most.`,
        })
      );
    }
  }

  async function subscribeToTable() {
    const query = new Parse.Query("VariateImage");
    query.equalTo("customerId", currentUser.customerId);

    try {
      const subscription = await query.subscribe();

      subscription.on("create", () => {
        fetchGalleryImages({
          galleryImages: [],
          setGalleryImages: setEditedImages,
          customerId: currentUser.customerId,
          fields: ["query", "medium", "style", "url", "imageId"],
          fetchOnce: true,
          setIsLoading,
          functionName: "fetchVariateImage",
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (subscribed) return;
    if (!setIsLoading || !currentUser) return;
    subscribeToTable();
    setSubscribed(false);
  }, [setIsLoading, currentUser]);

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <Link
          className={styles.container__close}
          href="/"
          onClick={() => setActiveLink("/")}
        />
        <h2 className={styles.container__title}>Variate composition</h2>
        <div className={styles.container__content}>
          <div className={styles.container__image_div}>
            <p className={styles.container__subtitle}>Original</p>
            <Image
              src={originalUrl ? originalUrl : placeholder_original}
              className={styles.container__image}
              width={500}
              height={500}
              alt=""
            />
          </div>
          <div className={styles.container__image_div}>
            <p className={styles.container__subtitle}>Variations</p>
            <div className={styles.container__gallery}>
              <div className={styles.container__gallery_wrapper}>
                {isLoading ? (
                  <div className="loading_div">
                    <ReactLoading
                      width={100}
                      height={100}
                      type={"bars"}
                      color="#dddddd"
                    />
                  </div>
                ) : (
                  <>
                    {isError && isError.value && <ErrorPopUp />}
                    <div className={styles.container__gallery_content}>
                      {editedImages &&
                        editedImages.map((element) => (
                          <div
                            key={element.imageId}
                            className={styles.container__gallery_image_div}
                          >
                            <Image
                              src={element.url || placeholder_variations}
                              width={500}
                              height={500}
                              className={styles.container__image}
                              alt=""
                            />
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container__controls}>
          <label
            htmlFor="create_variation_image"
            className={styles.container__upload_image_label}
          >
            {" "}
            Upload image
            <input
              className={styles.container__upload_image_input}
              type="file"
              name="create_variation_image"
              accept="image/*"
              id="create_variation_image"
              onChange={(e) =>
                uploadToClient(e, setOriginalImage, setOriginalUrl)
              }
            />
          </label>
          <div className={styles.container__buttons}>
            <Buttons src={editedImages} isBulk={true} />
            <Counter />
            <button
              className={styles.container__button}
              onClick={requestVariation}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
