import Parse from "parse";
import Image from "next/image";
import ReactLoading from "react-loading";
import ImageModal from "../ImageModal";
import { useState, useEffect } from "react";
import SearchField from "../common/SearchField";
import { useGetCurrentState } from "../common/ContextProvider";
import { useGetCurrentUser } from "../../helpers/useCurrentUser";
import { fetchGalleryImages } from "../../helpers/fetchGalleryImages";
import styles from "../../styles/components/TextToImage/GenerateNew.module.scss";
import ErrorPopUp from "../common/ErrorPopUp";

export default function GenerateNew({
  buttonText,
  newlyGeneratedImages,
  setNewlyGeneratedImages,
  style,
  medium,
  isLoading,
  setIsLoading,
  immediateResult,
}) {
  const currentUser = useGetCurrentUser();
  const { query, isError } = useGetCurrentState();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    newlyGeneratedImages ? newlyGeneratedImages[0] : "/"
  );

  async function subscribeToTable() {
    const query = new Parse.Query("TextToImage");
    query.equalTo("customerId", currentUser.customerId);

    const subscription = await query.subscribe();

    subscription.on("create", async () => {
      fetchGalleryImages({
        galleryImages: [],
        setGalleryImages: setNewlyGeneratedImages,
        customerId: currentUser.customerId,
        fetchOnce: true,
        setIsLoading,
        fields: ["query", "medium", "style", "url", "imageId"],
        functionName: "fetchTextToImage",
        setSelectedImage,
      });
    });
  }

  useEffect(() => {
    if (!setIsLoading || !currentUser) return;
    subscribeToTable();
  }, [setIsLoading, currentUser]);

  useEffect(() => {
    if (immediateResult) {
      setNewlyGeneratedImages(immediateResult.data);
    }
  }, [immediateResult]);

  useEffect(() => {
    if (!newlyGeneratedImages) return;
    if (selectedImage === "/") {
      setSelectedImage(newlyGeneratedImages[0]);
    }
  }, [newlyGeneratedImages]);

  function handleOpenModal(openModal, element) {
    setShowImageModal(openModal);
    setSelectedImage(element);
  }

  return (
    <>
      <div className={styles.generate_new}>
        <SearchField
          text={buttonText}
          sizeSelection={false}
          filterField={true}
          countSelection={true}
          style={style}
          medium={medium}
          setNewlyGeneratedImages={setNewlyGeneratedImages}
          extraPadding={true}
        />
        <div className={styles.results}>
          <div className={styles.results__wrapper}>
            <div className={styles.results__gallery}>
              {newlyGeneratedImages &&
                newlyGeneratedImages.map((element) => (
                  <div
                    className={styles.results__image_div}
                    key={element.imageId}
                  >
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
                        {isError.value && <ErrorPopUp />}

                        <Image
                          width={400}
                          height={400}
                          src={element.url}
                          className={styles.results__image}
                          onClick={() => handleOpenModal(true, element)}
                          alt={query}
                        />
                      </>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {showImageModal && newlyGeneratedImages && (
        <ImageModal
          images={newlyGeneratedImages}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setShowImageModal={setShowImageModal}
          style={style}
          medium={medium}
          isLoading={isLoading}
          isGenerate="true"
        />
      )}
    </>
  );
}
