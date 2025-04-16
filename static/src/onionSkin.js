import { drawGrid } from './gridOverlay.js';

export function drawOnionSkin(ctx, frames, width, height, options = {}) {
  const { opacity = 0.5, showGrid = false } = options;

  ctx.clearRect(0, 0, width, height);

  if (frames.length > 0) {
    ctx.globalAlpha = opacity;
    ctx.drawImage(frames[frames.length - 1], 0, 0);
    ctx.globalAlpha = 1.0;
  }

  if (showGrid) {
    drawGrid(ctx, width, height);
  }
}
