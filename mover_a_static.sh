#!/bin/bash

# Crear carpeta static si no existe
mkdir -p static/styles
mkdir -p static/src
mkdir -p static/icons
mkdir -p static/locales

# Mover archivos individuales
mv styles/main.css static/styles/
mv manifest.json static/
mv service-worker.js static/

# Mover carpetas de JS y recursos
mv src/*.js static/src/
mv src/logo.png static/src/

# Mover íconos y traducciones
mv public/icons/*.png static/icons/
mv public/locales/*.json static/locales/

echo "✅ Todos los archivos han sido movidos correctamente a la carpeta 'static/'."