export function resizeImage(image, setter) {
  const resizeWidth = window.innerWidth - 32;
  
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = (event) => {
    const image = new Image();
    image.src = event.target.result;
    image.onload = (el) => {
      const element = document.createElement("canvas");
      const scaleFactor = resizeWidth / el.target.width;
      element.width = resizeWidth;
      element.height = el.target.height * scaleFactor;

      const ctx = element.getContext("2d");
      ctx.drawImage(el.target, 0, 0, element.width, element.height);

      const srcEncoded = ctx.canvas.toDataURL("image/png", 1);

      setter(srcEncoded);
    }
  }
}