import Parse from "parse";
import { useState, useEffect } from "react";
import GenerateNew from "./GenerateNew";
import GeneratedBefore from "./GeneratedBefore";
import { useGetCurrentUser } from "../../helpers/useCurrentUser";
import { useGetCurrentState, useGetMethods } from "../common/ContextProvider";
import { fetchLatestPlaceholders } from "../../helpers/fetchLatestPlaceholders";
import styles from "../../styles/components/TextToImage/TextToImage.module.scss";

export default function TextToImage() {
  const [newlyGeneratedImages, setNewlyGeneratedImages] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const { setQuery, setStyle, setMedium, fetchGalleryImages, setIsLoading } =
    useGetMethods();
  const { style, medium, isLoading } =
    useGetCurrentState();
  const [page, setPage] = useState(1);
  const currentUser = useGetCurrentUser();

  useEffect(() => {
    if (!setQuery && !setStyle && !setMedium) return;
    if (currentUser === undefined) return;

    fetchLatestPlaceholders({
      limit: 3,
      imageSetter: setNewlyGeneratedImages,
      querySetter: setQuery,
      mediumSetter: setMedium,
      styleSetter: setStyle,
      customerId: currentUser && currentUser.customerId,
      fetchOnce: true,
      functionName: "fetchTextToImage",
      fields: ["query", "medium", "style", "url", "imageId"]
    });
  }, [setQuery, setStyle, setMedium]);

  useEffect(() => {
    fetchLatestPlaceholders({
      limit: 4,
      imageSetter: setGalleryImages,
      customerId: currentUser && currentUser.customerId,
      page,
      functionName: "fetchTextToImage",
      fields: ["query", "medium", "style", "url", "imageId"]
    });
  }, []);

  return (
    <main className={styles.section}>
      <div className={styles.section__wrapper}>
        <GenerateNew
          buttonText={"Generate"}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          newlyGeneratedImages={newlyGeneratedImages}
          setNewlyGeneratedImages={setNewlyGeneratedImages}
          style={style}
          medium={medium}
        />
        <GeneratedBefore
          buttonText={"Search"}
          fetchGalleryImages={fetchGalleryImages}
          galleryImages={galleryImages}
          setGalleryImages={setGalleryImages}
          page={page}
          setPage={setPage}
        />
      </div>
    </main>
  );
}
