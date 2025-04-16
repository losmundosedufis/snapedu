export function saveProject(frames) {
  const data = frames.map(frame => frame.toDataURL());
  localStorage.setItem('stopmotion_project', JSON.stringify(data));
  alert('Proxecto gardado localmente.');
}

export async function loadProject() {
  const data = localStorage.getItem('stopmotion_project');
  if (!data) return [];

  const urls = JSON.parse(data);
  const loadedFrames = await Promise.all(
    urls.map(url => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1280;
          canvas.height = 720;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas);
        };
      });
    })
  );

  return loadedFrames;
}

export async function exportToVideo(frames, canvas, fps = 6) {
  return new Promise(resolve => {
    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];

    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'animacion.webm';
      a.click();

      URL.revokeObjectURL(url);
      resolve();
    };

    let i = 0;
    const ctx = canvas.getContext('2d');

    const interval = setInterval(() => {
      if (i >= frames.length) {
        clearInterval(interval);
        recorder.stop();
        return;
      }

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = frames[i++];
    }, 1000 / fps);

    recorder.start();
  });
}

export function saveProjectToFile(frames) {
  const data = frames.map(frame => frame.toDataURL());
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'proxecto_stopmotion.json';
  a.click();

  URL.revokeObjectURL(url);
}

export async function loadProjectFromFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const urls = JSON.parse(e.target.result);
      const loadedFrames = await Promise.all(
        urls.map(url => {
          return new Promise(res => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = 1280;
              canvas.height = 720;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              res(canvas);
            };
          });
        })
      );
      resolve(loadedFrames);
    };
    reader.readAsText(file);
  });
}
