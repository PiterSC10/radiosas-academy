# RADIOSAS Academy 3.3 — Paula Master Edition ♥

Aplicación estática de estudio de Técnico/a Especialista en Radiodiagnóstico (TER/TSID), orientada a oposiciones del Servicio Andaluz de Salud. Proyecto independiente, no oficial.

## Contenido incluido realmente

- **1.000 preguntas de entrenamiento originales** (100 del banco anterior y 900 nuevas) con cuatro opciones y explicación.
- **Dos hojas de corrección** de 75 preguntas (2024 y 2025), con enlaces a los cuadernillos y plantillas del SAS. El texto de esas preguntas oficiales **no se ha transcrito** en la aplicación; se consulta en los PDF externos.
- Ficha documental de convocatoria 2022.
- Simulador, cronómetro para exámenes oficiales, nota con penalización de 0,25 por error, resultados y repaso de errores.
- Biblioteca con buscador por palabra y materia, favoritos, test de favoritos y soluciones de entrenamiento.
- Planificador de siete días, objetivo diario, seguimiento de 49 temas y recomendación de refuerzo según resultados.
- Exportación e importación de datos JSON y preguntas propias.
- Identidad Paula: logo, iconos PWA, tarjeta social y portada.

## Instalación en GitHub Pages

Sube **los archivos de este ZIP directamente a la raíz** del repositorio `PiterSC10/radiosas-academy`, sin carpeta exterior. En GitHub > Settings > Pages, selecciona **GitHub Actions** como fuente de publicación. El workflow `.github/workflows/deploy.yml` publica el sitio.

Dirección prevista: https://pitersc10.github.io/radiosas-academy/ (no es garantía de que esté publicado).

## Privacidad y límites

El progreso se guarda en `localStorage` del dispositivo, **no** en la nube. Exporta una copia periódicamente. La app no requiere registro, no incorpora IA remota ni notificaciones push. Los PDF oficiales necesitan conexión a Internet. El modo offline puede mantener la interfaz y el banco de entrenamiento tras una primera visita, pero no garantiza los PDF externos. Las reglas de puntuación de cada convocatoria deben verificarse con las bases oficiales; el cálculo del simulador es una referencia de práctica.

Las preguntas originales no sustituyen fuentes oficiales ni garantizan la exactitud del temario vigente. La función de recomendaciones es una regla estadística local, no un sistema de IA generativa.

## Comprobación

Con Node.js: `npm test`. Incluye pruebas de sintaxis, navegación, corrección, persistencia y estructura de contenido. No sustituye pruebas manuales en dispositivos reales.


## 3.1 — Examen compacto
El modo examen oculta el menú y fija los controles dentro de la pantalla, con scroll limitado al contenido de preguntas extensas. Las preguntas de entrenamiento se responden directamente. **Los cuadernillos oficiales 2024 y 2025 aún no tienen transcritos los enunciados:** se enlazan como documentación y no se simula su contenido. La imagen de `vista-previa-paula-edition.png` es una ilustración conceptual, no una captura funcional.

## 3.2 — Test rápidos sin repeticiones

El sistema anterior seleccionaba 10 preguntas al azar sin recordar los test anteriores, por lo que se repetían a menudo. La versión 3.2 amplía el banco a **100 preguntas originales distintas** y crea una **rotación persistente por modalidad**. En el test general de 10 preguntas, cada tanda es diferente hasta agotar las 100 (diez test de diez). Después comienza una nueva ronda y se evitan las preguntas de la sesión inmediatamente anterior. Las rotaciones por materias, favoritos y errores son independientes y dependen del número de preguntas disponibles.

La rotación se guarda en `localStorage`, se incluye en la exportación de datos JSON, y se reinicia cuando cambia el banco disponible en ese filtro. Si se cambia de navegador o se borran los datos, no se conservará la rotación sin importar una copia. Las nuevas preguntas son **originales de entrenamiento, NO oficiales del SAS**.


## 3.3 — Banco de 1.000 preguntas, antirrepetición también por concepto

- `bank-master.js` reside **en la raíz**: incluye 900 preguntas nuevas que se suman a las 100 previas de `data.js`.
- El contenido nuevo está basado en **450 fichas distintas de conocimiento**: parte tiene pregunta de identificación y pregunta de comprensión sobre el mismo concepto. Incluye **100 supuestos de cálculo** para reducir la repetición de conceptos. Hay por tanto **1.000 enunciados distintos, no 1.000 conceptos distintos**.
- Todas son **preguntas originales de entrenamiento, no cuadernillos oficiales transcritos**. Las respuestas están estructuralmente comprobadas, pero se recomienda revisión docente independiente para preparación de examen real.
- Los test rápidos recorren 1.000 preguntas sin repetir el *mismo enunciado* hasta agotar el banco, y también evitan presentar un mismo concepto en sesiones próximas cuando hay alternativas.
- El historial antiguo sigue guardado en `localStorage` (clave `radiosas_academy_v1`). No hace falta resetearlo.
- Las preguntas técnicas con normas, indicadores o recomendaciones pueden necesitar actualización con cambios normativos o protocolarios.
- Los exámenes históricos 2024 y 2025 **continúan con PDF externo y plantilla de respuestas**, no se han incorporado aún los enunciados oficiales al modo test integrado.
- No se utiliza carpeta `assets/`; todas las imágenes principales están en la raíz según indicación del propietario. Solo `.github/workflows/` contiene subcarpetas obligatorias para GitHub Actions.

**Bibliografía orientativa para revisión de contenido**: IAEA Radiation Protection of Patients (https://www.iaea.org/resources/rpop), American College of Radiology (https://www.acr.org/Clinical-Resources/Contrast-Manual), BOE (https://www.boe.es/). No se debe confundir esta selección de recursos con una certificación académica independiente de todas las preguntas.


## Versión 3.4 — Contador de preguntas distintas

La portada, los test por materia y Estadísticas muestran **Total / Usadas / Sin usar** con una barra de avance. Una pregunta pasa a «Usadas» cuando se incluye en una sesión de entrenamiento iniciada, incluso si esa sesión se abandona. Los IDs se cuentan una sola vez entre test rápidos, simulacros de entrenamiento, test por materia, repaso de errores y favoritos; los ejercicios oficiales que requieren PDF no cuentan dentro del banco de entrenamiento.

El contador se almacena en el navegador junto al historial y se incluye en la exportación JSON. Al actualizar desde versiones anteriores se recuperan los IDs de sesiones guardadas y terminadas, y cuando es posible se recupera la primera vuelta del sistema de rotación anterior. La migración de sesiones antiguas descartadas puede ser parcial si no existen registros que permitan reconstruirlas.

**Configuración → Reiniciar vuelta de preguntas** reinicia el contador y las rotaciones sin borrar las notas anteriores. La rotación es por modalidad: si se hacen test en varios modos, pueden aparecer preguntas ya usadas globalmente aunque aún queden preguntas sin utilizar en el banco general.
