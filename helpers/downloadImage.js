export async function downloadImage(imageSrc, isBulk) {
  if (!isBulk) {
    const image = await fetch(imageSrc.url);
    const blob = await image.blob();
    const imageURL = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = `muse.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    for (let i = 0; i < imageSrc.length; i++) {
      setTimeout(async () => {
        const image = await fetch(imageSrc[i].url);
        const blob = await image.blob();
        const imageURL = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = imageURL;
        link.download = `muse${i}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1000);
    }
  }
}
