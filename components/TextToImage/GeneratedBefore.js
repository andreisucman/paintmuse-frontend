import Parse from "parse";
import { useEffect, useState } from "react";
import SearchFieldDB from "../common/SearchFieldDB";
import ImageList from "../common/ImageList";
import { useGetMethods, useGetCurrentState } from "../common/ContextProvider";
import FloatingSearchBar from "../common/FloatingSearchBar";
import ImageModalSearch from "../ImageModalSearch";
import { fetchGalleryImages } from "../../helpers/fetchGalleryImages";
import { handleSearchImages } from "../../helpers/handleSearchImages";
import LoadMoreButton from "../common/LoadMoreButton";
import styles from "../../styles/components/TextToImage/GeneratedBefore.module.scss";

export default function GeneratedBefore({
  buttonText,
  galleryImages,
  setGalleryImages,
  page,
  setPage,
}) {
  const { querySearch, styleSearch, mediumSearch, isSearching } =
    useGetCurrentState();
  const { setIsSearching } = useGetMethods();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    galleryImages ? galleryImages[0] : "/"
  );

  function handleLoadMore() {
    setSelectedImage(galleryImages[galleryImages.length - 1]);
    if (isSearching) {
      handleSearchImages({
        page: page + 1,
        query: querySearch,
        galleryImages,
        setGalleryImages,
        style: styleSearch,
        medium: mediumSearch,
        fields: ["query", "medium", "style", "url", "imageId"],
        isSearching,
        setIsSearching,
        setSelectedImage,
      });
    } else {
      fetchGalleryImages({
        page: page + 1,
        galleryImages,
        setGalleryImages,
        setSelectedImage,
        fields: ["query", "medium", "style", "url", "imageId"],
        style: styleSearch,
        medium: mediumSearch,
        functionName: "fetchTextToImage",
      });
    }
    setPage((prevValue) => prevValue + 1);
  }

  return (
    <>
      <div className={styles.generated_before}>
        <div className={styles.generated_before__title_div}>
          <h3 className={styles.generated_before__title}>
            Browse existing muses
          </h3>
          <p className={styles.generated_before__description}>
            from community-generated art collection
          </p>
        </div>
        <SearchFieldDB
          text={buttonText}
          filterField={true}
          setPage={setPage}
          galleryImages={galleryImages}
          setGalleryImages={setGalleryImages}
          setSelectedImage={setSelectedImage}
          extraPadding={true}
          page={page}
          customerId={null}
        />
        <div
          className={styles.generated_before__image_container}
          id="generated_before_image_container"
        >
          <ImageList
            setSelectedImage={setSelectedImage}
            images={galleryImages && galleryImages}
            setShowImageModal={setShowImageModal}
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            handleLoadMore={handleLoadMore}
            isGenerate={false}
            hideLoadMore={true}
          />
          {galleryImages && (
            <LoadMoreButton onClickHandler={handleLoadMore} />
          )}
        </div>

        <FloatingSearchBar
          setPage={setPage}
          galleryImages={galleryImages}
          setGalleryImages={setGalleryImages}
          setSelectedImage={setSelectedImage}
          page={page}
        />
      </div>
      {showImageModal && (
        <ImageModalSearch
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setShowImageModal={setShowImageModal}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          galleryImages={galleryImages}
          setGalleryImages={setGalleryImages}
          setPage={setPage}
          page={page}
          handleLoadMore={handleLoadMore}
        />
      )}
    </>
  );
}
