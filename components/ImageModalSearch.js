import SearchFieldDB from "./common/SearchFieldDB";
import Buttons from "./common/Buttons";
import Image from "next/image";
import styles from "../styles/components/ImageModal.module.scss";
import ImageList from "./common/ImageList";

export default function ImageModalSearch({
  galleryImages,
  selectedImage,
  setSelectedImage,
  setShowImageModal,
  isModalOpen,
  setIsModalOpen,
  page,
  setPage,
  handleLoadMore,
  setGalleryImages,
}) {
  function handleCloseModal() {
    if (setIsModalOpen) {
      setIsModalOpen(false);
    }
    setShowImageModal(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <div className={styles.container__content}>
          <button
            className={styles.container__close}
            onClick={handleCloseModal}
          />
          <SearchFieldDB
            text={"Search"}
            filterField={true}
            setPage={setPage}
            galleryImages={galleryImages}
            setGalleryImages={setGalleryImages}
            setSelectedImage={setSelectedImage}
            page={page}
          />
          {galleryImages.length !== 0 && (
            <div className={styles.container__image_div}>
              <Image
                src={selectedImage && selectedImage.url}
                className={styles.container__image}
                width={700}
                height={700}
                alt={(selectedImage && selectedImage.query) || ""}
              />
              <div className={styles.container__gallery}>
                <div className={styles.container__gallery_wrapper}>
                  <ImageList
                    images={galleryImages}
                    description={false}
                    setShowImageModal={setShowImageModal}
                    setSelectedImage={setSelectedImage}
                    disableDescription={true}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    handleLoadMore={handleLoadMore}
                    isGenerate={false}
                    isModal={true}
                  />
                </div>
              </div>
            </div>
          )}
          {galleryImages.length === 0 && (
            <div className={styles.container__nothing_found}>Nothing found</div>
          )}
          {selectedImage && selectedImage.query && (
            <p className={styles.container__image_desc}>
              {selectedImage.query &&
                `${selectedImage.query
                  .charAt(0)
                  .toUpperCase()}${selectedImage.query.slice(1)}`}
              {selectedImage.style && `| ${selectedImage.style}`}
              {selectedImage.medium && `| ${selectedImage.medium}`}
            </p>
          )}

          <Buttons src={selectedImage} />
        </div>
      </div>
    </div>
  );
}
