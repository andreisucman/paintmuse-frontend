import axios from "axios";
import Parse from "parse";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { drawCanvas } from "../helpers/drawCanvas";
import { downloadImage } from "../helpers/downloadImage";
import { resizeImage } from "../helpers/resizeImage";
import {
  useGetCurrentState,
  useGetMethods,
} from "../components/common/ContextProvider";
import { useGetCurrentUser } from "../helpers/useCurrentUser";
import { fetchGalleryImages } from "../helpers/fetchGalleryImages";
import Counter from "../components/common/Counter";
import ReactLoading from "react-loading";
import placeholder from "../public/assets/placeholder.svg";
import styles from "../styles/EditExistingArt.module.scss";
import ErrorPopUp from "../components/common/ErrorPopUp";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function EditExistingArt() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [originalImage, setOriginalImage] = useState();
  const [maskImage, setMaskImage] = useState();
  const [aspect, setAspect] = useState(1 / 1);
  const [step, setStep] = useState(1);
  const [finishedUrl, setFinishedUrl] = useState();
  const [brushSize, setBrushSize] = useState(25);
  const [query, setQuery] = useState("");
  const { imageCount, isError } = useGetCurrentState();
  const { setIsError } = useGetMethods();
  const currentUser = useGetCurrentUser();
  const [resultsGallery, setResultsGallery] = useState([
    placeholder,
    placeholder,
    placeholder,
  ]);
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(placeholder);
  const [showModal, setShowModal] = useState(false);

  const stepTitles = {
    1: "Upload your image",
    2: "Crop your image",
    3: "Select the number of variations",
  };

  const stepDescriptions = {
    1: "Upload the image that you want variations of",
    2: "Drag the crop square as needed and click 'Crop'",
    3: "Select the number of variations and click 'Generate'",
  };

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);

      if (window.innerWidth < 733) {
        resizeImage(e.target.files[0], setImgSrc);
      } else {
        const reader = new FileReader();
        reader.addEventListener("load", () =>
          setImgSrc(reader.result?.toString() || "")
        );
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function handleGenerate() {
    try {
      requestVariation();
    } catch (err) {
      console.log(err);
    }
  }

  async function requestVariation() {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const parseOriginal = new Parse.File("original", {
        base64: originalImage,
      });
      await parseOriginal.save();

      const params = {
        original: parseOriginal.url(),
        count: imageCount,
        customerId: currentUser.customerId,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/requestVariation`,
        params,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.message) {
        setIsLoading(false);
        setIsError({ value: true, message: response.data.message });
        return;
      }

      setStep((prevValue) => prevValue + 1);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsError(
        Object.assign({}, isError, {
          value: true,
          message: `An error occured. Make sure you upload a PNG/JPG image and try again.`,
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
          setGalleryImages: setResultsGallery,
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
    setSubscribed(true);
  }, [setIsLoading, currentUser]);

  useEffect(() => {
    if (step !== 3) return;
    drawCanvas(imgSrc, canvasRef.current, completedCrop, brushSize);

    setTimeout(() => {
      setOriginalImage(canvasRef.current.toDataURL("image/png;base64"));
    }, 500);
  }, [step]);

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        {isError && isError.value && <ErrorPopUp />}
        <div className={styles.steps}>
          {!isLoading && (
            <h2 className={styles.container__title}>Variate composition</h2>
          )}
          <div className={styles.steps__wrapper}>
            {!isLoading && step < 4 && (
              <>
                <h3 className={styles.steps__title}>
                  Step {step} - {stepTitles[step]}
                </h3>
                <p>{stepDescriptions[step]}</p>
                {step === 3 && (
                  <div
                    className={styles.generate__div}
                    style={{ justifyContent: "left" }}
                  >
                    <Counter />
                    <button
                      className={styles.generate}
                      onClick={handleGenerate}
                    >
                      Generate
                    </button>
                  </div>
                )}
                <div className={styles.buttons}>
                  {step === 1 && (
                    <div className={styles.upload}>
                      <label
                        htmlFor="upload_original_image"
                        className={styles.upload__label}
                      >
                        {" "}
                        Upload image
                        <input
                          className={styles.upload__input}
                          type="file"
                          name="edit_image_step_one"
                          accept="image/*"
                          id="upload_original_image"
                          onChange={onSelectFile}
                        />
                      </label>
                    </div>
                  )}
                  {step === 2 && (
                    <button
                      className={styles.button}
                      onClick={() => setStep((prevValue) => prevValue + 1)}
                    >
                      Crop
                    </button>
                  )}
                </div>
                {step === 1 && imgSrc && (
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={() => setStep((prevValue) => prevValue + 1)}
                  />
                )}

                {step >= 3 && !isLoading && (
                  <div style={{ margin: "auto" }}>
                    {!!completedCrop && (
                      <canvas
                        ref={canvasRef}
                        style={{
                          objectFit: "contain",
                          width: completedCrop.width,
                          height: completedCrop.height,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>
                )}
                {finishedUrl && (
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={finishedUrl}
                    style={{
                      width: completedCrop.width,
                      height: completedCrop.height,
                      margin: "auto",
                    }}
                  />
                )}
                {step === 2 && imgSrc && (
                  <ReactCrop
                    crop={crop}
                    onChange={(crop, percentCrop) => setCrop(crop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className={
                      step === 2
                        ? styles.crop
                        : `${styles.crop} ${styles.crop_hide}`
                    }
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                )}
              </>
            )}
            {isLoading && (
              <div className={styles.loading}>
                <div className="loading_div">
                  <h3 className={styles.loading__title}>Hold tight!</h3>
                  <p className={styles.loading__description}>
                    We're generating your results.
                  </p>
                  <ReactLoading
                    width={100}
                    height={100}
                    type={"bars"}
                    color="#dddddd"
                  />
                </div>
              </div>
            )}
            {!isLoading && step === 4 && (
              <>
                <div className={styles.results}>
                  <div className={styles.results__gallery}>
                    {resultsGallery.map((element) => (
                      <div
                        className={styles.results__image_div}
                        onClick={() => setShowModal(true)}
                        key={element.imageId}
                      >
                        <Image
                          src={element.url}
                          width={484}
                          height={484}
                          className={styles.results__image}
                          onClick={() => setSelectedImage(element)}
                          alt=""
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <button
                    className={styles.button}
                    onClick={() => location.reload()}
                  >
                    Try again
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => downloadImage(resultsGallery, true)}
                  >
                    Download all
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {showModal && (
          <div className={styles.view_modal}>
            <div className={styles.view_modal__wrapper}>
              <div
                className={styles.view_modal__close}
                onClick={() => setShowModal(false)}
              ></div>
              <div className={styles.view_modal__image_div}>
                <Image
                  src={selectedImage.url}
                  width={600}
                  height={600}
                  className={styles.view_modal__image}
                  alt=""
                />
              </div>
              <button
                className={styles.button}
                style={{ marginLeft: "auto" }}
                onClick={() => downloadImage(selectedImage)}
              >
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
