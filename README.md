# RADIOSAS Academy 3.0 — Paula Master Edition ♥

Aplicación estática de estudio de Técnico/a Especialista en Radiodiagnóstico (TER/TSID), orientada a oposiciones del Servicio Andaluz de Salud. Proyecto independiente, no oficial.

## Contenido incluido realmente

- **40 preguntas originales** de entrenamiento con respuesta y explicación.
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
El modo examen oculta el menú y fija los controles dentro de la pantalla, con scroll limitado al contenido de preguntas extensas. Las preguntas de entrenamiento se responden directamente. **Los cuadernillos oficiales 2024 y 2025 aún no tienen transcritos los enunciados:** se enlazan como documentación y no se simula su contenido. La imagen de `assets/vista-previa-paula-edition.png` es una ilustración conceptual, no una captura funcional.
