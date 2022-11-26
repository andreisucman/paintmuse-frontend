export async function drawCanvas(image, canvas, crop, brushSize, isDraw) {
  const picture = new Image();
  picture.src = image;

  const mobile = window.innerWidth < 1024;

  if (mobile) {
    brushSize = brushSize * 0.75;
  }

  var isIdle = true;

  picture.onload = () => {
    const ctx = canvas.getContext("2d");

    function drawstart(event) {
      const rect = canvas.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";

      ctx.beginPath();
      ctx.moveTo(event.pageX - rect.left, event.pageY - rect.top);
      isIdle = false;
    }
    function drawmove(event) {
      const rect = canvas.getBoundingClientRect();

      if (isIdle) return;

      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#fff";
      ctx.lineTo(event.pageX - rect.left, event.pageY - rect.top);
      ctx.stroke();
      ctx.restore();
    }

    function drawend(event) {
      if (isIdle) return;
      drawmove(event);
      isIdle = true;
    }

    function touchstart(event) {
      drawstart(event.touches[0]);
    }
    function touchmove(event) {
      drawmove(event.touches[0]);
      event.preventDefault();
    }
    function touchend(event) {
      drawend(event.changedTouches[0]);
    }

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
      if (mobile) {
        document.addEventListener("touchstart", touchstart, false);
        document.addEventListener("touchmove", touchmove, false);
        document.addEventListener("touchend", touchend, false);
      } else {
        document.addEventListener("mousedown", drawstart, false);
        document.addEventListener("mousemove", drawmove, false);
        document.addEventListener("mouseup", drawend, false);
      }
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
