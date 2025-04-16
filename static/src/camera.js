export async function initCamera(videoElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 }
    });
    videoElement.srcObject = stream;
    videoElement.play();
    videoElement.style.display = 'block';
    videoElement.style.backgroundColor = 'black';
    return stream;
  } catch (error) {
    console.error('Erro ao acceder á cámara:', error);
    throw new Error('Non foi posible acceder á cámara.');
  }
}
