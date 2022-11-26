import Image from "next/image";
import LoadMoreButton from "./LoadMoreButton";
import styles from "../../styles/components/common/ImageList.module.scss";

export default function ImageList({
  images,
  setSelectedImage,
  disableDescription,
  isModalOpen,
  setIsModalOpen,
  setShowImageModal,
  isGenerate,
  handleLoadMore,
  isModal,
  hideLoadMore
}) {
  
  function handleSelect(image) {
    if (isGenerate) {
      setSelectedImage(image);
    } else {
      if (isModalOpen) {
        setSelectedImage(image);
      } else {
        setShowImageModal(true);
        setSelectedImage(image);
        if (setIsModalOpen) {
          setIsModalOpen(true);
        }
      }
    }
  }

  return (
    <>
      <div
        className={
          isModal ? `${styles.list} ${styles.list_modal}` : styles.list
        }
      >
        {images &&
          images.map((element) => (
            <div
              className={styles.list__image_div}
              onClick={() => handleSelect(element)}
              key={element.imageId}
            >
              <Image
                src={element.url}
                width={484}
                height={484}
                className={styles.list__image}
                alt={element.query || ""}
              />
              {!disableDescription && element.query && (
                <p
                  className={styles.list__image_query}
                  onClick={() => handleSelect(element)}
                >{`${element.query
                  .charAt(0)
                  .toUpperCase()}${element.query.slice(1)}`}</p>
              )}
              {!disableDescription && element.query && (
                <div
                  className={styles.list__image_description}
                  onClick={() => handleSelect(element)}
                >
                  Style:{" "}
                  {element.style &&
                    element.style !== "Select style" &&
                    `${element.style
                      .charAt(0)
                      .toUpperCase()}${element.style.slice(1)}`}{" "}
                  {element.medium &&
                    element.medium !== "Select medium" &&
                    ` | ${element.medium
                      .charAt(0)
                      .toUpperCase()}${element.medium.slice(1)}`}
                </div>
              )}
            </div>
          ))}
        {!isGenerate && images && !hideLoadMore && (
          <LoadMoreButton onClickHandler={handleLoadMore} />
        )}
      </div>
    </>
  );
}
