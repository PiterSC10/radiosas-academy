# RADIOSAS 5.0 — Laboratorio de Radiología ♥

**Primera entrega funcional:** visor interactivo de esquema de tórax frontal en la pestaña «Laboratorio RX».

- 18 ejercicios de localización con una ilustración anatómica original `rx-torax-esquema.svg` y zonas de respuesta.
- Modo estudio con feedback inmediato, pista e interpretación didáctica; modo examen con preguntas en orden aleatorio y puntuación al finalizar.
- Interruptor de visor (efecto suave hospitalario/neón), navegación anterior/siguiente y alternativa accesible por lista.
- Registro independiente `labAttempts`, `labSeen` y `labDraft` en el **mismo** `localStorage` de siempre (`radiosas_academy_v1`), visible en Estadísticas.
- No altera los 5.000 ejercicios de entrenamiento ni sus identificadores, notas, favoritos o estadísticas. No cuenta los ejercicios visuales como parte del banco de 5.000.
- Mantiene todos los archivos e imágenes directamente en la raíz. La única carpeta técnica continúa siendo `.github/workflows/`.

**Límites:** La imagen es una **ilustración didáctica**, no una radiografía clínica ni una imagen diagnóstica. Las localizaciones son orientativas. El ejercicio de localizar puntos debe ser revisado por una persona experta antes de considerarse material clínico validado. Para añadir radiografías reales, escoger fuentes compatibles con reutilización, documentar licencias, anonimización cuando sea relevante y revisar la calidad anatómica de cada caso. No incorporar un estudio clínico generado por IA como evidencia.

**Instalación:** subir contenido del ZIP a la raíz de `PiterSC10/radiosas-academy`, verificando que `lab-data.js`, `rx-torax-esquema.svg` y `index.html` comparten directorio. GitHub Pages configurado con Actions. La caché del service worker se actualiza con nombre nuevo.

**Pruebas:** ejecutar `npm test`; esto valida estructura y lógica mediante tests automatizados. La experiencia visual y táctil real necesita además revisión manual en iPhone.
