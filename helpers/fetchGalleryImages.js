import Parse from "parse";

export async function fetchGalleryImages({
  page,
  galleryImages,
  setGalleryImages,
  setSelectedImage,
  sorted,
  style,
  medium,
  customerId,
  fetchOnce,
  setIsLoading,
  functionName,
  fields,
}) {
  try {
    const data = {
      limit: 4,
      fields,
      sorted,
      page,
      style,
      medium,
      customerId,
      fetchOnce,
    };

    const response = await Parse.Cloud.run(functionName, data);

    if (response.length === 0) return;
    setGalleryImages([...galleryImages, ...response]);

    if (setSelectedImage) {
      setSelectedImage(response[0]);
    }

    if (setIsLoading) {
      setIsLoading(false);
    }
  } catch (err) {
    console.log(err);
  }
}
