import { useState, useEffect } from "react";
import { useGetMethods } from "../common/ContextProvider";
import { fetchLatestPlaceholders } from "../../helpers/fetchLatestPlaceholders";
import { fetchGalleryImages } from "../../helpers/fetchGalleryImages";
import { useGetCurrentUser } from "../../helpers/useCurrentUser";
import RequestsSubsection from "./RequestsSubsection";
import styles from "../../styles/components/Account/RequestsSubsection.module.scss";

export default function RequestsHistory() {
  const methods = useGetMethods();
  const currentUser = useGetCurrentUser();

  const [TTIGallery, setTTIGallery] = useState(null);
  const [editGallery, setEditGallery] = useState(null);
  const [variateGallery, setVariateGallery] = useState(null);
  const [selectedImageTTI, setSelectedImageTTI] = useState(null);
  const [selectedImageEdit, setSelectedImageEdit] = useState(null);
  const [selectedImageVariate, setSelectedImageVariate] = useState(null);
  const [TTIpage, setTTIPage] = useState(1);
  const [editPage, setEditPage] = useState(1);
  const [variatePage, setVariatePage] = useState(1);
  const [pageTTI, setPageTTI] = useState(1);
  const [pageEdit, setPageEdit] = useState(1);
  const [pageVariate, setPageVariate] = useState(1);

  useEffect(() => {
    fetchLatestPlaceholders({
      limit: 4,
      imageSetter: setTTIGallery,
      page: TTIpage,
      functionName: "fetchTextToImage",
      fields: ["query", "medium", "style", "url", "createdAt", "imageId"],
      setSelectedImage: setSelectedImageTTI,
      customerId: currentUser.customerId,
    });

    fetchLatestPlaceholders({
      limit: 4,
      imageSetter: setEditGallery,
      page: pageEdit,
      functionName: "fetchEditImage",
      fields: ["query", "url", "createdAt", "imageId"],
      setSelectedImage: setSelectedImageEdit,
      customerId: currentUser.customerId,
    });

    fetchLatestPlaceholders({
      limit: 4,
      imageSetter: setVariateGallery,
      page: pageVariate,
      functionName: "fetchVariateImage",
      fields: ["url", "createdAt", "imageId"],
      setSelectedImage: setSelectedImageVariate,
      customerId: currentUser.customerId,
    });
  }, []);

  function handleLoadMoreTTI() {
    fetchGalleryImages({
      page: TTIpage + 1,
      galleryImages: TTIGallery,
      setGalleryImages: setTTIGallery,
      setSelectedImage: setSelectedImageTTI,
      fields: ["query", "medium", "style", "url", "createdAt", "imageId"],
      functionName: "fetchTextToImage",
      customerId: currentUser.customerId,
    });
    setTTIPage((prevValue) => prevValue + 1);
  }

  function handleLoadMoreEdits() {
    fetchGalleryImages({
      page: editPage + 1,
      galleryImages: editGallery,
      setGalleryImages: setEditGallery,
      setSelectedImage: setSelectedImageEdit,
      fields: ["query", "url", "createdAt", "imageId"],
      functionName: "fetchEditImage",
    });
    setEditPage((prevValue) => prevValue + 1);
  }

  function handleLoadMoreVariate() {
    fetchGalleryImages({
      page: variatePage + 1,
      galleryImages: variateGallery,
      setGalleryImages: setVariateGallery,
      setSelectedImage: setSelectedImageVariate,
      fields: ["url", "createdAt", "imageId"],
      functionName: "fetchVariateImage",
    });
    setVariatePage((prevValue) => prevValue + 1);
  }

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <h2 className={styles.container__title}>Requests History</h2>
        <RequestsSubsection
          galleryImages={TTIGallery}
          setGalleryImages={setTTIGallery}
          loadMoreHandler={handleLoadMoreTTI}
          selectedImage={selectedImageTTI}
          setSelectedImage={setSelectedImageTTI}
          page={pageTTI}
          setPage={setPageTTI}
          title="Muses from words"
        />
        <RequestsSubsection
          galleryImages={editGallery}
          setGalleryImages={setEditGallery}
          loadMoreHandler={handleLoadMoreEdits}
          selectedImage={selectedImageEdit}
          setSelectedImage={setSelectedImageEdit}
          page={editPage}
          setPage={setPageEdit}
          title="Edit image"
        />
        <RequestsSubsection
          galleryImages={variateGallery}
          setGalleryImages={setVariateGallery}
          loadMoreHandler={handleLoadMoreVariate}
          selectedImage={selectedImageVariate}
          setSelectedImage={setSelectedImageVariate}
          page={variatePage}
          setPage={setPageVariate}
          title="Variate image"
        />
      </div>
    </div>
  );
}
