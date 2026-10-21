# RADIOSAS 5.0 — Verificación de la integración

Base oficial: `95919035cceab147e3905866f4be4d2a63d9f248`.

- Parche adaptado a la portada 4.0.1 y sus mejoras; no se ha reemplazado la aplicación por una copia antigua.
- `npm test`: pruebas de sintaxis, banco de 5.000 preguntas, rotación, progreso, migraciones, identidad visual y laboratorio.
- Pruebas del laboratorio: 18 zonas por coordenadas, respuestas correctas e incorrectas, bloqueo del visor apagado, estudio, examen, recuperación del borrador, resultado 17/18, historial y conservación del banco.
- `data.js`, `bank-master.js` y `bank-5000.js` permanecen sin cambios.
- Suite adicional `npm run test:browser` preparada para Chromium y WebKit, cinco viewports y capturas reales. No ejecutada en este entorno: la descarga del navegador no se completó.
- Publicación y prueba visual en Actions bloqueadas por GitHub: `403 Resource not accessible by integration` al crear el árbol de cambios. No se ha actualizado `main` ni la web pública.
- La experiencia en un iPhone físico y la correspondencia visual de las zonas con la ilustración aún necesitan comprobación; no se presentan como verificadas.
