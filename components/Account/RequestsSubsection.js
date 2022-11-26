import Image from "next/image";
import { useEffect, useState } from "react";
import ImageModalSearch from "../ImageModalSearch";
import LoadMoreButton from "../common/LoadMoreButton";
import styles from "../../styles/components/Account/RequestsSubsection.module.scss";
import { getReadableDate } from "../../helpers/getReadableDate";

export default function RequestsSubsection({
  title,
  galleryImages,
  setGalleryImages,
  loadMoreHandler,
  selectedImage,
  setSelectedImage,
  page,
  setPage,
}) {
  const [showImageModal, setShowImageModal] = useState(false);

  function handleImageClick(element) {
    setSelectedImage(element);
    setShowImageModal(true);
  }

  return (
    <>
      {galleryImages && galleryImages.length > 0 && (
        <div className={styles.container__subsection}>
          <p className={styles.container__subsection_title}>{title}</p>
          <div className={styles.container__content}>
            {galleryImages &&
              galleryImages.map((element) => (
                <div
                  key={element.imageId}
                  className={styles.container__image_div}
                  onClick={() => handleImageClick(element)}
                >
                  <Image
                    src={element ? element.url : placeholder}
                    width={484}
                    height={484}
                    className={styles.container__image}
                    alt=""
                  />
                  <>
                    {element.query && (
                      <p className={styles.container__image_description}>
                        {element.query.charAt(0).toUpperCase() +
                          element.query.slice(1)}
                      </p>
                    )}
                    <div>
                      {element.style && element.medium && (
                        <p className={styles.container__image_description}>
                          {element.style} | {element.medium}
                        </p>
                      )}
                      {element.createdAt && (
                        <p className={styles.container__image_description}>
                          Generated on: {getReadableDate(element.createdAt)}
                        </p>
                      )}
                    </div>
                  </>
                </div>
              ))}
          </div>
          {galleryImages && galleryImages.length > 3 && (
            <LoadMoreButton onClickHandler={loadMoreHandler} />
          )}
          {showImageModal && (
            <ImageModalSearch
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              showImageModal={showImageModal}
              setShowImageModal={setShowImageModal}
              galleryImages={galleryImages}
              setGalleryImages={setGalleryImages}
              setPage={setPage}
              page={page}
              handleLoadMore={loadMoreHandler}
            />
          )}
        </div>
      )}
    </>
  );
}
