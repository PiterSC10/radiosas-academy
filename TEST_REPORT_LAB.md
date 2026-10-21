# RADIOSAS 5.0 — Verificación de la integración

Base oficial: `95919035cceab147e3905866f4be4d2a63d9f248`.

- Portada 4.0.1, caricatura de Paula y mejoras recientes conservadas.
- `npm test`: sintaxis, banco de 5.000 preguntas, rotación, progreso, migraciones, identidad visual y laboratorio correctos.
- Pruebas del laboratorio: 18 zonas por coordenadas, respuestas correctas e incorrectas, visor apagado, estudio, examen, recuperación del borrador, resultado 17/18, historial y conservación del banco.
- `data.js`, `bank-master.js` y `bank-5000.js` permanecen sin cambios.
- `npm run test:browser`: Chromium y WebKit, con toques reales sobre las 18 estructuras, estudio, pistas, examen, recarga, revisión histórica y conservación del progreso general.
- Capturas en 430×932, 390×844, 375×667, 320×568 y 1440×1000; sin desplazamiento horizontal ni errores JavaScript.
- Corregida la cabecera que podía tapar zonas táctiles; soporte pointerup para toques SVG en Safari. Controles sin superposición sobre las pistas.
- Evidencia de la validación previa: https://github.com/PiterSC10/radiosas-academy/actions/runs/39669627870
- El workflow repite las comprobaciones antes de cada publicación en main y conserva las capturas como artefactos.
- WebKit en viewport móvil es una prueba automatizada del motor de Safari; no equivale a una prueba en un iPhone físico. La imagen es una ilustración didáctica, no una radiografía clínica ni material clínico validado.
