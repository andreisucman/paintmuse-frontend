import SearchField from "./common/SearchField";
import ReactLoading from "react-loading";
import Buttons from "./common/Buttons";
import Image from "next/image";
import styles from "../styles/components/ImageModal.module.scss";
import ImageList from "./common/ImageList";

export default function ImageModal({
  images,
  selectedImage,
  setSelectedImage,
  setShowImageModal,
  style,
  medium,
  isGenerate,
  isLoading,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <div className={styles.container__content}>
          <SearchField
            text={"Generate"}
            filterField={true}
            style={style}
            medium={medium}
          />
          <button
            className={styles.container__close}
            onClick={() => setShowImageModal(false)}
          />
          <div className={styles.container__image_div}>
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
              <Image
                src={selectedImage.url}
                className={styles.container__image}
                width={700}
                height={700}
                alt={selectedImage.query || ""}
              />
            )}
            <div className={styles.container__gallery}>
              <div className={styles.container__gallery_wrapper}>
                <ImageList
                  description={false}
                  setSelectedImage={setSelectedImage}
                  images={images}
                  disableDescription={true}
                  isGenerate={isGenerate}
                  isModal={true}
                />
              </div>
            </div>
          </div>
          <Buttons
            src={selectedImage}
            images={images}
            isGenerate={isGenerate}
          />
        </div>
      </div>
    </div>
  );
}
