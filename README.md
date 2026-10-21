# RADIOSAS Academy 3.7 — Paula Master Edition ♥

Aplicación estática de estudio de Técnico/a Especialista en Radiodiagnóstico (TER/TSID), orientada a oposiciones del Servicio Andaluz de Salud. Proyecto independiente, no oficial.

## Contenido incluido realmente

- **5.000 enunciados de entrenamiento**, 1.000 anteriores y 4.000 añadidos en 3.7, con cuatro opciones y explicación. El material generado automáticamente requiere revisión académica, y las variantes no equivalen a 5.000 conceptos distintos.
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


## Actualizaciones de banco sin perder estadísticas (3.5)

- Mantenemos `localStorage` bajo la clave compatible `radiosas_academy_v1`.
- La web recuerda qué IDs pertenecían al banco de la versión anterior y reconoce los que se añaden o retiran.
- Los IDs de las preguntas publicadas son estables. Nunca reutilices un mismo ID para una pregunta nueva o con distinta respuesta.
- El contador calcula totales y pendientes desde el banco actual; los intentos antiguos siguen guardados.
- Cada modalidad mantiene la cola de preguntas pendientes, incorpora las nuevas al principio y evita repetir las anteriores hasta acabar su vuelta.
- Las preguntas personalizadas importadas no se presentan como nueva versión pública.
- Antes de actualizar o modificar el dominio, exporta los datos desde Configuración. GitHub no guarda automáticamente el historial personal, porque está en el navegador.
- Cambiar el dominio, borrar los datos del navegador o abrir la web desde otro dispositivo **no** sincroniza las estadísticas. Para ello se necesitaría una cuenta y un backend.


## 3.7 — Banco real de 5.000 preguntas de entrenamiento

La aplicación **carga efectivamente 5.000 objetos de pregunta**: las 1.000 preguntas publicadas con anterioridad más 4.000 nuevas en `bank-5000.js`. Cada objeto posee enunciado, cuatro opciones, respuesta indicada, explicación, materia, concepto e identificador estable. Los 4.000 nuevos enunciados constan de **3.600 ejercicios derivados de 450 fichas conceptuales** y **400 ejercicios numéricos con parámetros distintos**. Se conservan las primeras 1.000 preguntas e identificadores originales.

**Transparencia editorial**: la ampliación se ha generado programáticamente, con variaciones de forma sobre conceptos comunes. Por tanto **5.000 preguntas no equivalen a 5.000 conocimientos diferentes**. Los controles automatizados comprueban estructura, singularidad literal de los enunciados y resultados aritméticos, pero **no sustituyen la revisión de contenido por personal experto**. Las preguntas son originales de entrenamiento, *no* enunciados oficiales SAS transcritos. Los exámenes SAS reales siguen accesibles mediante PDF.

Tras subir una nueva versión bajo la misma URL de GitHub Pages, las notas y preguntas realizadas se conservan en `localStorage` (clave estable `radiosas_academy_v1`), si Safari mantiene esos datos. Se recomienda **Configuración → Exportar datos JSON antes de actualizar**. Los test sin repetir seleccionan preferentemente las 4.000 preguntas añadidas; el marcador calcula preguntas **distintas por ID**, no conocimientos distintos.

### Archivos fundamentales, todos en raíz

`index.html`, `app.js`, `data.js`, `bank-master.js`, **`bank-5000.js`**, `styles.css`, `sw.js`, `manifest.webmanifest`, imágenes de Paula. La única ruta de infraestructura anidada es `.github/workflows/deploy.yml` para GitHub Pages. **No existe carpeta `assets/`**.

### Pruebas

`npm test` incluye la nueva prueba `test-bank-5000-real.js`. Comprueba la carga integrada de 5.000 preguntas verdaderas del paquete, sus 10 materias, las opciones y correcciones, el guardado de las notas existentes y la selección de las nuevas. El informe de distribución y las limitaciones de revisión aparecen en `INFORME_BANCO_5000.md`.


## 3.8 Paula Visual Edition
Portada con ilustración personalizada, acceso rápido a exámenes, test y estadísticas. Todos los archivos de imágenes en raíz. El modo examen compacto y las estadísticas permanecen sin cambios.


## Paula Master Edition 4.0 — branding visual

La portada, el avatar y la imagen social se han actualizado con una ilustración inspirada en las fotografías de referencia aportadas. El sistema de preguntas, IDs, clave `radiosas_academy_v1` de localStorage, correcciones y estadísticas se mantienen sin cambios funcionales. No elimines los datos de navegación ni cambies de origen de GitHub Pages para conservar el historial. Los retratos de Paula son recursos gráficos ilustrados. Los gráficos de rendimiento de la interfaz se calculan a partir de los intentos guardados; no se muestran notas de ejemplo.


## 4.0.1 — Web responsive preparada para publicar desde la raíz

Portada con navegación superior, menú móvil, siete accesos, retrato separado de los controles y paneles de progreso reales. Las notas, aciertos, errores, materias y últimos siete días se calculan exclusivamente desde el historial local. Sin resultados, se muestran estados vacíos. Los 5.000 objetos y sus IDs se mantienen sin cambios; la ampliación previa contiene variantes generadas de entrenamiento y no sustituye exámenes oficiales ni revisión experta.

Se conserva `radiosas_academy_v1`. Al cargar con datos anteriores se conserva una instantánea local en `radiosas_academy_v1_backup_before_4_0` (si hay espacio disponible), sin sustituir una copia previa. Exportación/importación JSON disponible en Configuración. No existe sincronización entre dispositivos. La versión de caché es `radiosas-v4-0.1-paula`; solo se retiran cachés anteriores de la aplicación, nunca localStorage.

Validación: `npm test`, test interactivo de 10 preguntas, corrección y nueva tanda sin repetir en 320/390/768/1440 px; exportación/importación JSON, recarga y arranque sin conexión con datos de la versión 3.7. Las pruebas usan datos aislados, sin acceder al navegador personal de Paula.
