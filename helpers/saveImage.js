export async function saveImage(src, setter) {
  const originalImage = new Image();
  originalImage.src = blob;
  originalImage.onload = () => {
    setter(originalImage);
  };
}
