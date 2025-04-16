export function drawGrid(ctx, width, height, step = 40) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
  
  export function setupKeyboardShortcuts(actions) {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'c': // Capturar
          actions.capture();
          break;
        case 'd': // Duplicar
          actions.duplicate();
          break;
        case 'x': // Eliminar
          actions.delete();
          break;
        case '+': // Zoom in
        case '=':
          actions.zoomIn();
          break;
        case '-': // Zoom out
          actions.zoomOut();
          break;
        case 'g': // Grella
          actions.toggleGrid();
          break;
      }
    });
  }
  