let animationIntervalId = null;

export function playAnimation(frames, canvas, ctx, fps = 6) {
  if (!frames.length) return;

  let index = 0;
  const interval = 1000 / fps;

  // Limpia cualquier animación previa
  if (animationIntervalId !== null) {
    clearInterval(animationIntervalId);
  }

  animationIntervalId = setInterval(() => {
    if (!canvas || !ctx || canvas.width === 0 || canvas.height === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (frames[index] instanceof HTMLImageElement || frames[index] instanceof HTMLCanvasElement) {
      ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
    } else {
      console.warn("⚠️ Frame no válido en índice", index, frames[index]);
    }

    index++;
    if (index >= frames.length) {
      clearInterval(animationIntervalId);
      animationIntervalId = null;
      console.log("✅ Reproducción finalizada");

      // Mostrar último frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const lastFrame = frames[frames.length - 1];
      if (lastFrame instanceof HTMLImageElement || lastFrame instanceof HTMLCanvasElement) {
        ctx.drawImage(lastFrame, 0, 0, canvas.width, canvas.height);
      }

      // Dibujar grid si aplica
      if (typeof drawGrid === 'function') {
        drawGrid(ctx, canvas);
      }
    }
  }, interval);
}

export function stopAnimation(frames, canvas, ctx, showGrid = false, drawGrid = null) {
  console.log("🟥 stopAnimation ejecutado", {
    framesLength: frames.length,
    canvasSize: [canvas?.width, canvas?.height],
    ctxExists: !!ctx
  });

  if (animationIntervalId !== null) {
    clearInterval(animationIntervalId);
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