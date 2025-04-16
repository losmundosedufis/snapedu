export async function loadLanguage(langCode = null) {
  const defaultLang = 'gl-GL';
  const lang = langCode || localStorage.getItem('preferredLanguage') || navigator.language || defaultLang;

  try {
    const response = await fetch(`/locales/${lang}.json`);
    const translations = await response.json();
    applyTranslations(translations);
    localStorage.setItem('preferredLanguage', lang);
  } catch (err) {
    console.error(`Erro ao cargar o idioma (${lang}):`, err);
  }
}

function applyTranslations(strings) {
  document.title = strings.app_title || document.title;
  document.querySelector('h1').textContent = strings.app_title || 'Stopmotion Classroom';
  document.getElementById('privacyNotice').textContent = strings.privacy_notice || '';

  document.getElementById('capture').textContent = strings.capture || 'Capturar';
  document.getElementById('duplicate').textContent = strings.duplicate || 'Duplicar';
  document.getElementById('delete').textContent = strings.delete || 'Eliminar';
  document.getElementById('zoom-in').textContent = strings.zoom_in || '+';
  document.getElementById('zoom-out').textContent = strings.zoom_out || '-';
  document.getElementById('toggle-grid').textContent = strings.toggle_grid || 'Grella';
}
