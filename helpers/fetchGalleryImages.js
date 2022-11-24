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
    const response = await Parse.Cloud.run(functionName, {
      limit: 4,
      fields,
      sorted,
      page,
      style,
      medium,
      customerId,
      fetchOnce,
    });
  
    if (response.length === 0) return;
    setGalleryImages([...galleryImages, ...response]);
  
    // if (!fetchOnce) {
      if (setSelectedImage) {
        setSelectedImage(response[0]);
      }
    // }
  
    if (setIsLoading) {
      setIsLoading(false);
    }
  } catch (err) {
    console.log(err);
  }
}