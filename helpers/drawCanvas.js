export async function drawCanvas(image, canvas, crop, brushSize, isDraw) {
  const picture = new Image();
  picture.src = image;

  const pos = { x: 0, y: 0 };

  function setPosition(e) {
    const rect = canvas.getBoundingClientRect();
    pos.x = e.clientX - rect.left;
    pos.y = e.clientY - rect.top;
  }

  picture.onload = () => {
    const ctx = canvas.getContext("2d");

    function draw(e) {
      if (e.buttons !== 1) return;
      setPosition(e);

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();

      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#fff";

      ctx.moveTo(pos.x, pos.y);
      setPosition(e);
      ctx.lineTo(pos.x, pos.y);

      ctx.stroke();

      ctx.restore();
    }

    if (isDraw) {
      document.addEventListener("mousemove", draw);
      document.addEventListener("touchmove", draw);
      document.addEventListener("touchstart", setPosition);
      document.addEventListener("touchend", setPosition);
      document.addEventListener("mousedown", setPosition);
      document.addEventListener("mouseenter", setPosition);
    }

    const scaleX = picture.naturalWidth / picture.width;
    const scaleY = picture.naturalHeight / picture.height;

    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.round(crop.width) * pixelRatio;
    canvas.height = Math.round(crop.height) * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      picture,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  };
}
