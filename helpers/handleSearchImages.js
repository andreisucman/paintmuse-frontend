import Parse from "parse";
import { fetchGalleryImages } from "./fetchGalleryImages";

export async function handleSearchImages({
  page,
  query,
  galleryImages,
  setGalleryImages,
  setSelectedImage,
  style,
  medium,
  fields,
  isSearching,
  setIsSearching,
  customerId,
}) {
  if (!isSearching) {
    setIsSearching(true);
  }

  if (
    (!query ||
      query === "" ||
      query === "Describe the image you're looking for") &&
    style === "Select style" &&
    medium === "Select medium"
  ) {
    setIsSearching(false);
    fetchGalleryImages({
      page: 1,
      galleryImages: [],
      setGalleryImages,
      setSelectedImage,
      fields: ["query", "medium", "style", "url", "imageId"],
      style,
      medium,
      functionName: "fetchTextToImage",
      customerId,
    });
    return;
  }

  const params = {
    searchQuery: query,
    limit: 4,
    page,
    style,
    medium,
    customerId,
    fields,
  };

  try {
    const response = await Parse.Cloud.run("findImages", params);

    if (page > 1) {
      setSelectedImage([galleryImages[galleryImages.length - 1]]);
      setGalleryImages([...galleryImages, ...response]);
    } else {
      setGalleryImages(response);
      setSelectedImage(response[0]);
    }
  } catch (err) {
    console.log(err);
  }
}
