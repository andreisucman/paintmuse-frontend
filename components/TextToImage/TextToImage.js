import Parse from "parse";
import { useState, useEffect } from "react";
import GenerateNew from "./GenerateNew";
import GeneratedBefore from "./GeneratedBefore";
import { useGetCurrentState, useGetMethods } from "../common/ContextProvider";
import { fetchLatestPlaceholders } from "../../helpers/fetchLatestPlaceholders";
import styles from "../../styles/components/TextToImage/TextToImage.module.scss";

export default function TextToImage() {
  const [newlyGeneratedImages, setNewlyGeneratedImages] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const { setQuery, setStyle, setMedium, fetchGalleryImages, setIsLoading } =
    useGetMethods();
  const { style, medium, isLoading, immediateResult } =
    useGetCurrentState();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!setQuery && !setStyle && !setMedium) return;

    fetchLatestPlaceholders({
      limit: 3,
      imageSetter: setNewlyGeneratedImages,
      querySetter: setQuery,
      mediumSetter: setMedium,
      styleSetter: setStyle,
      fetchOnce: true,
      functionName: "fetchTextToImage",
      fields: ["query", "medium", "style", "url", "imageId"]
    });
  }, [setQuery, setStyle, setMedium]);

  useEffect(() => {
    fetchLatestPlaceholders({
      limit: 4,
      imageSetter: setGalleryImages,
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
          immediateResult={immediateResult}
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
