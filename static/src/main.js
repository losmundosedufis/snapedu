const videoElement = document.getElementById('preview');

async function getAvailableCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const cameraSelect = document.getElementById('camera-select');
    cameraSelect.innerHTML = '';
    if (videoDevices.length === 0) {
      console.warn('Non se detectaron cámaras. Iniciando cámara por defecto...');
      initCamera();
    } else {
      videoDevices.forEach((device) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Cámara ${cameraSelect.length + 1}`;
        cameraSelect.appendChild(option);
      });
      // Iniciar con a primeira cámara automaticamente
      initCamera(videoDevices[0].deviceId);
    }
  } catch (error) {
    console.error('Erro ao listar dispositivos de vídeo:', error);
  }
}

async function initCamera(deviceId = null) {
  try {
    const constraints = {
      video: deviceId ? { deviceId: { exact: deviceId } } : { width: 1280, height: 720 }
    };
    const stream = await navigator.mediaDevices.getUserMedia({ video: constraints.video });
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = () => {
      videoElement.play().catch((e) => {
        console.warn('Erro ao iniciar a reprodución do vídeo:', e);
      });
    };
  } catch (err) {
    console.error('Erro ao acceder á cámara:', err);
    alert('Non foi posible acceder á cámara. Asegúrate de que está conectada e habilitada.');
  }
}

// Iniciar cámara ao cargar
window.addEventListener('DOMContentLoaded', () => {
  getAvailableCameras();
  initCamera();
});

let frames = [];
let currentZoom = 1;
let showGrid = false;
let onionSkinOpacity = 0.35;

const canvas = document.getElementById('onion-skin-canvas');
const ctx = canvas.getContext('2d');

const thumbnailContainer = document.getElementById('thumbnail-container');

const opacitySlider = document.getElementById('onionOpacity');
if (opacitySlider) {
  opacitySlider.value = onionSkinOpacity;
  opacitySlider.addEventListener('input', (e) => {
    onionSkinOpacity = parseFloat(e.target.value);
    drawOnionSkin();
  });
}

function updateThumbnails() {
  if (!thumbnailContainer) return;
  thumbnailContainer.innerHTML = '';
  frames.forEach((frame, index) => {
    const thumb = document.createElement('canvas');
    thumb.width = 80;
    thumb.height = 60;
    const thumbCtx = thumb.getContext('2d');
    thumbCtx.drawImage(frame, 0, 0, thumb.width, thumb.height);
    thumb.classList.add('thumbnail');
    thumbnailContainer.appendChild(thumb);
  });
}

function resizeCanvas() {
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.style.width = `${videoElement.clientWidth}px`;
  canvas.style.height = `${videoElement.clientHeight}px`;
}
videoElement.addEventListener('loadedmetadata', () => {
  resizeCanvas();
  videoElement.style.objectFit = 'cover';
  videoElement.style.width = '100%';
  videoElement.style.height = '100%';
});

// Capturar imaxe
document.getElementById('capture').addEventListener('click', () => {
  const frame = document.createElement('canvas');
  frame.width = videoElement.videoWidth;
  frame.height = videoElement.videoHeight;
  frame.getContext('2d').drawImage(videoElement, 0, 0);
  frames.push(frame);
  drawOnionSkin();
  updateThumbnails();
});

// Duplicar última imaxe
document.getElementById('duplicate').addEventListener('click', () => {
  if (frames.length > 0) {
    const lastFrame = frames[frames.length - 1];
    const copy = document.createElement('canvas');
    copy.width = lastFrame.width;
    copy.height = lastFrame.height;
    copy.getContext('2d').drawImage(lastFrame, 0, 0);
    frames.push(copy);
    drawOnionSkin();
    updateThumbnails();
  }
});

// Eliminar última imaxe
document.getElementById('delete').addEventListener('click', () => {
  if (frames.length > 0) {
    frames.pop();
    drawOnionSkin();
    updateThumbnails();
  }
});

// Zoom
document.getElementById('zoom-in').addEventListener('click', () => {
  currentZoom += 0.1;
  updateZoom();
});

document.getElementById('zoom-out').addEventListener('click', () => {
  currentZoom = Math.max(0.5, currentZoom - 0.1);
  updateZoom();
});

function updateZoom() {
  videoElement.style.transform = `scale(${currentZoom})`;
  videoElement.style.transformOrigin = "center center";
}

// Grella visual
document.getElementById('toggle-grid').addEventListener('click', () => {
  showGrid = !showGrid;
  drawOnionSkin();
});

function drawOnionSkin() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (frames.length > 0) {
    ctx.globalAlpha = onionSkinOpacity;
    ctx.drawImage(frames[frames.length - 1], 0, 0);
    ctx.globalAlpha = 1.0;
  }

  if (showGrid) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)'; // Cor máis visible
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawGrid(ctx, canvas) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  const step = 40;
  for (let x = 0; x < canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

import { saveProject, loadProject, exportToVideo, saveProjectToFile, loadProjectFromFile } from './storage.js';
import { loadLanguage } from './i18n.js';
import { playAnimation } from './player.js';
import { stopAnimation } from './player.js';

document.getElementById('save-project').addEventListener('click', () => {
  if (!frames.length) {
    alert('Non hai frames para gardar.');
    return;
  }
  saveProjectToFile(frames);
});

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const loadedFrames = await loadProjectFromFile(file);
    if (loadedFrames.length > 0) {
      frames = loadedFrames;
      drawOnionSkin();
      updateThumbnails();
      alert('Proxecto cargado desde arquivo.');
    }
  }
});

document.getElementById('load-project').addEventListener('click', () => {
  fileInput.click();
});

document.getElementById('load-project').addEventListener('click', async () => {
  console.log("Botón Cargar pulsado");
  const loadedFrames = await loadProject();
  if (loadedFrames.length > 0) {
    frames = loadedFrames;
    drawOnionSkin();
    updateThumbnails();
    alert('Proxecto cargado.');
  }
});

// Añadir funcionalidade de reproducción
document.getElementById('play-animation').addEventListener('click', () => {
  console.log("Botón Reproducir pulsado", frames.length);
  playAnimation(frames, canvas, ctx);
});

// Conectar botón de exportación de vídeo
document.getElementById('export-video').addEventListener('click', () => {
  if (!frames.length) {
    alert('Non hai frames para exportar.');
    return;
  }
  exportToVideo(frames, canvas, 6); // 6 FPS como valor inicial
});

document.getElementById('stop-animation').addEventListener('click', () => {
  stopAnimation();
  drawOnionSkin(); // Volver mostrar a última frame
});

// Cargar idioma ao iniciar
loadLanguage();

// Forzar visibilidade e capas correctas
videoElement.style.display = 'block';
videoElement.style.backgroundColor = 'black';
videoElement.style.objectFit = 'cover';
videoElement.style.width = '100%';
videoElement.style.height = '100%';
videoElement.style.zIndex = '0';

canvas.style.zIndex = '1';
canvas.style.pointerEvents = 'none';
canvas.style.backgroundColor = 'transparent';
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';

const cameraSelect = document.getElementById('camera-select');
if (cameraSelect) {
  cameraSelect.addEventListener('change', (e) => {
    initCamera(e.target.value);
  });
}

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./public/service-worker.js')
      .then(reg => console.log('✔️ Service Worker rexistrado'))
      .catch(err => console.error('❌ Fallo ao rexistrar SW:', err));
  });
} else {
  console.log('ℹ️ Service Worker non rexistrado: execución local detectada');
}