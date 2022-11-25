import { useState, useRef, useEffect } from "react";
import styles from "../../styles/components/common/Cropper.module.scss";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { canvasPreview } from "../../helpers/canvasPreview";
import { useDebounceEffect } from "../../helpers/useDebounceEffect";

export default function Cropper({ originalUrl, placeholder, showCanvas }) {
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [aspect, setAspect] = useState(1 / 1);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "px",
          width: 400,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop &&
        completedCrop.width &&
        completedCrop &&
        completedCrop.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  return (
    <div className={styles.container}>
      {!originalUrl && (
        <div className={styles.image__div}>
          <img className={styles.image} src={placeholder.src} />
        </div>
      )}
      {originalUrl && !showCanvas && (
        <ReactCrop
          crop={crop}
          onChange={(crop, percentCrop) => setCrop(crop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          className={styles.crop}
        >
          <div className={styles.image__div}>
            <img
              ref={imgRef}
              alt="Crop me"
              className={styles.image}
              src={originalUrl}
              onLoad={onImageLoad}
            />
          </div>
        </ReactCrop>
      )}
      {!!completedCrop && (
        <canvas
          ref={previewCanvasRef}
          className={
            showCanvas
              ? styles.canvas
              : `${styles.canvas} ${styles.canvas_hide}`
          }
        />
      )}
      <div className={styles.thumbnail}>
        <div className={styles.thumbnail__wrapper}>
          <div className={styles.thumbnail__content}>
            <img className={styles.thumbnail__image} src={placeholder.src} />
            <img className={styles.thumbnail__image} src={placeholder.src} />
            <img className={styles.thumbnail__image} src={placeholder.src} />
            <img className={styles.thumbnail__image} src={placeholder.src} />
            <img className={styles.thumbnail__image} src={placeholder.src} />
            <img className={styles.thumbnail__image} src={placeholder.src} />
            <img className={styles.thumbnail__image} src={placeholder.src} />
            <img className={styles.thumbnail__image} src={placeholder.src} />
          </div>
        </div>
      </div>
    </div>
  );
}
