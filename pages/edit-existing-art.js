import axios from "axios";
import Parse from "parse";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { drawCanvas } from "../helpers/drawCanvas";
import { downloadImage } from "../helpers/downloadImage";
import { resizeImage } from "../helpers/resizeImage";
import { handleQueryEntry } from "../helpers/handleQueryEntry";
import {
  useGetCurrentState,
  useGetMethods,
} from "../components/common/ContextProvider";
import { useGetCurrentUser } from "../helpers/useCurrentUser";
import { saveImage, saveOriginalImage } from "../helpers/saveImage";
import { fetchGalleryImages } from "../helpers/fetchGalleryImages";
import Counter from "../components/common/Counter";
import ReactLoading from "react-loading";
import placeholder from "../public/assets/placeholder.svg";
import styles from "../styles/EditExistingArt.module.scss";

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
    3: "Mark areas to be modified",
    4: "Describe the final result",
  };

  const stepDescriptions = {
    1: "Upload the image that you want to be edited",
    2: "Use your mouse to crop your image to a square and click 'Next'",
    3: "Paint the areas that need to be changed and click 'Next'",
    4: "Describe what the final image should look like (as a whole image). Then select the number of variations and click 'Generate'.",
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

  // function saveCanvas(canvas, setter) {
  //   const image = new Image();
  //   image.src = canvas.toDataURL("image/png;base64");
  //   // var link = document.createElement("a"),
  //   //   e;
  //   // link.download = "muse";
  //   setter(image);

  //   // if (document.createEvent) {
  //   //   e = document.createEvent("MouseEvents");
  //   //   e.initMouseEvent(
  //   //     "click",
  //   //     true,
  //   //     true,
  //   //     window,
  //   //     0,
  //   //     0,
  //   //     0,
  //   //     0,
  //   //     0,
  //   //     false,
  //   //     false,
  //   //     false,
  //   //     false,
  //   //     0,
  //   //     null
  //   //   );

  //   //   link.dispatchEvent(e);
  //   // } else if (link.fireEvent) {
  //   //   link.fireEvent("onclick");
  //   // }
  // }

  function handleGenerate() {
    try {
      requestEdit();
    } catch (err) {
      console.log(err);
    }
  }

  function handleSaveMask() {
    setMaskImage(canvasRef.current.toDataURL("image/png;base64"));
    setStep((prevValue) => prevValue + 1);
  }

  async function requestEdit() {
    if (!currentUser) return;
    if (!query || query === "") return;

    try {
      setIsLoading(true);
      const parseOriginal = new Parse.File("original", {
        base64: originalImage,
      });
      await parseOriginal.save();
      const parseMask = new Parse.File("mask", { base64: maskImage });
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
    const query = new Parse.Query("EditImage");
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
          functionName: "fetchEditImage",
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
    drawCanvas(imgSrc, canvasRef.current, completedCrop, brushSize, true);

    setTimeout(() => {
      setOriginalImage(canvasRef.current.toDataURL("image/png;base64"));
    }, 500);
  }, [step]);

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <div className={styles.steps}>
          {!isLoading && (
            <h2 className={styles.container__title}>Edit existing art</h2>
          )}
          <div className={styles.steps__wrapper}>
            {!isLoading && step < 5 && (
              <>
                <h3 className={styles.steps__title}>
                  Step {step} - {stepTitles[step]}
                </h3>
                <p>{stepDescriptions[step]}</p>
                {step === 4 && (
                  <div className={styles.generate__div}>
                    <input
                      type="text"
                      className={styles.generate__text}
                      onChange={(e) =>
                        handleQueryEntry(e.target.value, setQuery)
                      }
                      placeholder="Example: A mob standing around the fire in hell and the devil wearing a pink jacket measuring the temperature of fire"
                    />
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
                      Next
                    </button>
                  )}
                  {step === 3 && (
                    <button className={styles.button} onClick={handleSaveMask}>
                      Next
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
                {step === 4 && imgSrc && (
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={maskImage}
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
                {step === 3 && !isLoading && (
                  <div style={{ margin: "auto" }}>
                    {!!completedCrop && (
                      <canvas
                        ref={canvasRef}
                        style={{
                          objectFit: "contain",
                          width: completedCrop.width,
                          height: completedCrop.height,
                          cursor: "crosshair",
                        }}
                      />
                    )}
                  </div>
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
            {!isLoading && step === 5 && (
              <>
                <div className={styles.results}>
                  <div className={styles.results__gallery}>
                    {resultsGallery.map((element) => (
                      <div
                        className={styles.results__image_div}
                        onClick={() => setShowModal(true)}
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
                <div className={styles.lower_buttons}>
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
