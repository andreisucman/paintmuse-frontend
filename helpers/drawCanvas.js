export async function drawCanvas(image, canvas, crop, brushSize, isDraw) {
  const picture = new Image();
  picture.src = image;

  const isMobile = window.innerWidth < 1024;

  if (isMobile) {
    brushSize *= 0.5;
  }

  const pos = { x: 0, y: 0 };
  var isIdle = true;

  function setPosition(e) {
    const rect = canvas.getBoundingClientRect();
    pos.x = e.clientX - rect.left;
    pos.y = e.clientY - rect.top;
  }

  picture.onload = () => {
    const ctx = canvas.getContext("2d");

    function drawstart(e) {
      setPosition(e)
      ctx.globalCompositeOperation = "destination-out";
      
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      isIdle = false;
    }
    function drawmove(e) {
      if (isIdle) return;
      setPosition(e)
      ctx.lineTo(pos.x, pos.y);
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    }
    function drawend(e) {
      setPosition(e)
      if (isIdle) return;
      drawmove(e);
      isIdle = true;
    }

    function touchstart(event) { drawstart(event.touches[0]) }
    function touchmove(event) { drawmove(event.touches[0]); event.preventDefault(); }
    function touchend(event) { drawend(event.changedTouches[0]) }

    function draw(e) {
      if (e.buttons !== 1) return;

      if (isMobile) {
        setPosition(e.touches[0]);
      } else {
        setPosition(e);
      }

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
      document.addEventListener('touchstart', touchstart, false);
      document.addEventListener('touchmove', touchmove, false);
      document.addEventListener('touchend', touchend, false);        
    
      document.addEventListener('mousedown', drawstart, false);
      document.addEventListener('mousemove', drawmove, false);
      document.addEventListener('mouseup', drawend, false);
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
