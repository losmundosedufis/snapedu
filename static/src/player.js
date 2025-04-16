let animationIntervalId = null;

export function playAnimation(frames, canvas, ctx, fps = 6) {
  if (!frames.length) return;

  let index = 0;
  const interval = 1000 / fps;

  function drawNextFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
    index = (index + 1) % frames.length;
    animationIntervalId = setTimeout(drawNextFrame, interval);
  }

  drawNextFrame();
}

export function stopAnimation(frames, canvas, ctx, showGrid = false, drawGrid = null) {
  if (animationIntervalId !== null) {
    clearTimeout(animationIntervalId);
    animationIntervalId = null;
  }

  if (frames.length > 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[frames.length - 1], 0, 0, canvas.width, canvas.height);

    if (showGrid && typeof drawGrid === 'function') {
      drawGrid(ctx, canvas);
    }
  }
}