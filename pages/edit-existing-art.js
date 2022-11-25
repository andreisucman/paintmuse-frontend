import Parse from "parse";
import axios from "axios";
import Link from "next/link";
// import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Buttons from "../components/common/Buttons";
import placeholder from "../public/assets/placeholder_arrows.svg";
import Counter from "../components/common/Counter";
import styles from "../styles/EditExistingArt.module.scss";
import {
  useGetCurrentState,
  useGetMethods,
} from "../components/common/ContextProvider";
import { useGetCurrentUser } from "../helpers/useCurrentUser";
import { handleQueryEntry } from "../helpers/handleQueryEntry";
import { uploadToClient } from "../helpers/uploadToClient";
import { fetchGalleryImages } from "../helpers/fetchGalleryImages";
import ReactLoading from "react-loading";
import ErrorPopUp from "../components/common/ErrorPopUp";

export default function EditExistingArt() {
  const { setActiveLink } = useGetMethods();
  const [originalImage, setOriginalImage] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [query, setQuery] = useState(null);
  const [editedImages, setEditedImages] = useState([
    placeholder,
    placeholder,
    placeholder,
  ]);
  const [readyToDownload, setReadyToDownload] = useState(false);
  const { imageCount, isLoading, isError } = useGetCurrentState();
  const { setIsLoading, setIsError } = useGetMethods();
  const [editingStarted, setEditingStarted] = useState(false);
  const [cropCompleted, setCropCompleted] = useState(false);
  const currentUser = useGetCurrentUser();
  const canvasRef = useRef();

  useEffect(() => {
    if (!originalImage) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const canvasWidth = 600;
    const canvasHeight = canvasWidth;
    
    const image = new Image();
    image.src = originalUrl;
    
    image.onload = () => {
      ctx.drawImage(image, 0, 0, image.width, image.height);

    };

  }, [originalImage]);

  async function requestEdits() {
    if (!currentUser) return;
    if (!query || query === "") return;

    try {
      setIsLoading(true);

      const parseOriginal = new Parse.File("original", originalImage);
      await parseOriginal.save();
      const parseMask = new Parse.File("maks", maskImage);
      await parseMask.save();

      const params = {
        original: parseOriginal.url(),
        mask: parseMask.url(),
        prompt: query,
        count: imageCount,
        customerId: currentUser.customerId,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/requestEdit`,
        params,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      setIsLoading(false);
      setIsError(
        Object.assign({}, isError, {
          value: true,
          message: `Make sure 1) Both original and mask images are pixel-perfect square. 2) Both images have at most 1024x1024 resolution.`,
        })
      );
    }
  }

  async function subscribeToTable() {
    const query = new Parse.Query("EditImage");
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
          functionName: "fetchEditImage",
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!setIsLoading || !currentUser) return;
    subscribeToTable();
  }, [setIsLoading, currentUser]);

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <div className={styles.container__content}>
          <Link
            className={styles.container__close}
            href="/"
            onClick={() => setActiveLink("/")}
          />
          <div className={styles.container__image_div}>
            <div className={styles.container__gallery}>
              <div className={styles.container__gallery_wrapper}>
                {isLoading && (
                  <div className="loading_div">
                    <ReactLoading
                      width={100}
                      height={100}
                      type={"bars"}
                      color="#dddddd"
                    />
                  </div>
                )}
                {!isLoading && editingStarted && (
                  <div>
                    <canvas ref={canvasRef} className={styles.canvas}></canvas>
                  </div>
                )}
                {!isLoading && !editingStarted && (
                  <>
                    {isError && isError.value && <ErrorPopUp />}
                    <div className={styles.container__gallery_items}>
                      {editedImages.map((element) => (
                        <div
                          key={element.imageId || Math.random()}
                          className={styles.container__gallery_image_div}
                        >
                          <img
                            src={element.url || placeholder}
                            width={600}
                            height={600}
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
            <div className={styles.container__controls}>
              <h2 className={styles.container__title}>Edit existing art</h2>
              <div className={styles.container__step}>
                <h3 className={styles.container__step_title}>Step 1</h3>
                <div className={styles.container__step_description}>
                  Upload the picture that you want to edit. It must be a square
                  PNG up to 4MB in size and 1024x1024 resolution at most.
                </div>
                <div className={styles.container__choose_image_div}>
                  <label
                    htmlFor="upload_original_image"
                    className={styles.container__choose_image_label}
                  >
                    {" "}
                    Upload image
                    <input
                      className={styles.container__choose_image_input}
                      type="file"
                      name="edit_image_step_one"
                      accept="image/*"
                      id="upload_original_image"
                      onChange={(e) =>
                        uploadToClient(e, setOriginalImage, setOriginalUrl)
                      }
                    />
                  </label>
                  <p>{originalImage ? originalImage.name : ""}</p>
                </div>
              </div>
              <div className={styles.container__step}>
                <h3 className={styles.container__step_title}>Step 2</h3>
                <p className={styles.container__step_description}>
                  Of the same picture erase the part that you want to be
                  modified and upload the resulting image with the transparent
                  part (mask).
                </p>
                <div className={styles.container__choose_image_div}>
                  <label
                    htmlFor="upload_mask_image"
                    className={styles.container__choose_image_label}
                  >
                    {" "}
                    Upload image
                    <input
                      className={styles.container__choose_image_input}
                      type="file"
                      name="edit_image_step_two"
                      accept="image/*"
                      id="upload_mask_image"
                      onChange={(e) =>
                        uploadToClient(e, setMaskImage, undefined)
                      }
                    />
                  </label>
                  <p>{maskImage ? maskImage.name : ""}</p>
                </div>
              </div>
              <div className={styles.container__step}>
                <h3 className={styles.container__step_title}>Step 3</h3>
                <p className={styles.container__step_description}>
                  Describe the final composition that you want to get as a whole
                  image (not just the erased part).
                </p>
                <textarea
                  name="edit_image_description"
                  className={styles.container__step_description_textarea}
                  placeholder="A man sitting on a tree in the forest and holding a stick in his hand"
                  onChange={(e) => handleQueryEntry(e.target.value, setQuery)}
                ></textarea>
              </div>
              <div className={styles.container__buttons}>
                <Counter />
                <button
                  className={styles.container__button}
                  onClick={requestEdits}
                >
                  Generate
                </button>
              </div>
              <Buttons src={editedImages} isBulk={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
