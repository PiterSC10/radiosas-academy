# RADIOSAS Academy 2.0

**Plataforma independiente de preparación para la oposición de Técnico/a Especialista en Radiodiagnóstico del Servicio Andaluz de Salud.**

**Nombre recomendado del repositorio:** `radiosas-academy`  
**URL prevista en GitHub Pages:** `https://pitersc10.github.io/radiosas-academy/` (no estará disponible hasta que se publique).

## Qué funciona en esta versión

- Panel de inicio con métricas obtenidas exclusivamente de tus intentos reales.
- Menú lateral adaptable al móvil y al ordenador.
- Exámenes oficiales de **2025 y 2024**, turno libre: cuadernillo original enlazado / integrado desde el SAS, hoja interactiva de 75 respuestas y autocorrección con claves definitivas incorporadas.
- **2022:** acceso a la fuente oficial, todavía sin corrección interactiva integrada.
- 40 preguntas **de entrenamiento propias** con opciones, explicación y categorías; no son preguntas oficiales.
- Test generales, por materia, repaso de preguntas falladas y simulacros de entrenamiento ajustados a la disponibilidad del banco.
- Resultados con aciertos, errores, blancos y puntuación; referencia de penalización: resta de 0,25 por fallo.
- Historial, estadísticas por materia, gráfico de notas y revisión de cada pregunta.
- Seguimiento manual de 49 temas, enlazado al programa oficial del SAS.
- Guardado de sesiones sin terminar y persistencia de estadísticas con `localStorage`.
- Exportación/importación de copias JSON; importación de preguntas de entrenamiento JSON.
- PWA: icono, manifiesto y caché de archivos estáticos propios. Los PDF externos del SAS requieren conexión.
- Pruebas de consistencia y una acción de GitHub para publicar la web si las pruebas pasan.

## Publicar en GitHub Pages (recomendado)

1. En [GitHub](https://github.com/new), crea el repositorio **`radiosas-academy`**. Puede ser público; **no subas secretos ni información sensible**.
2. Descomprime `RADIOSAS_Academy_2_GitHub.zip`. Dentro encontrarás una carpeta `radiosas-academy`.
3. Abre el nuevo repositorio → **Add file → Upload files**. Sube **el contenido de la carpeta** a la raíz, no la carpeta contenedora. Es importante incluir también `.github/workflows/deploy.yml` (GitHub puede ocultar archivos con punto; verifica que la carpeta `.github` se ha subido).
4. En el repositorio, abre **Settings → Pages** y cambia **Build and deployment → Source** a **GitHub Actions**.
5. En la pestaña **Actions**, comprueba que se ha ejecutado correctamente el flujo **Verificar y publicar RADIOSAS**.
6. Visita **https://pitersc10.github.io/radiosas-academy/** una vez aparezca el despliegue correcto.

> Si GitHub no permite subir la carpeta `.github` mediante navegador, usa GitHub Desktop (añade todos los archivos y publica el commit) o crea manualmente `.github/workflows/deploy.yml` desde la interfaz web copiando el archivo incluido. Otra posibilidad es elegir en Pages “Deploy from a branch / main / root”: la web también funciona sin el workflow, pero no tendrás el paso automático de tests.

### Alternativa: Vercel

Importa el mismo repositorio en Vercel, Framework Preset **Other**, directorio raíz `/`, sin comando de build. Para esta versión no necesitas base de datos ni variables secretas.

## Uso

- En **Exámenes reales**, abre un PDF original y responde en la hoja digital. Puedes abrir el cuadernillo en otra pestaña si el iPhone no muestra el visor.
- La corrección se basa en las letras de las plantillas incorporadas para 2024 y 2025. Revisa siempre la resolución oficial en caso de discrepancia o cambio.
- En **Test por temas** las preguntas son originales de práctica, no históricos del SAS.
- En **Estadísticas** se muestran solo datos generados en tu propio navegador.
- En **Configuración** exporta una copia JSON para conservar tu historial; importar una copia reemplaza los datos existentes.

## Desarrollo / pruebas

Requiere Node.js 20 o superior solo para ejecutar las pruebas:

```bash
npm test
```

La aplicación en sí no requiere instalación de dependencias, compilación ni `npm install`.

## Límites pendientes (sin falsas promesas)

- El banco propio contiene **40 preguntas**, no 1.000; se puede ampliar mediante JSON después de revisar la exactitud.
- Los PDF oficiales **no están transcritos** pregunta por pregunta a HTML. Se consultan en el visor original con hoja digital de respuestas.
- No se incluye actualmente examen interactivo 2022 ni 2018.
- No existe backend, inicio de sesión, sincronización entre dispositivos ni panel privado de administración. Un sitio estático por sí solo no puede ofrecer cuentas seguras.
- El historial se guarda en `localStorage` del navegador; usa copias JSON, especialmente antes de borrar datos.
- Los temporizadores y simulacros son entrenamiento, no acreditación oficial ni garantía de plaza.
- La lista de 49 temas es una referencia de seguimiento: los títulos exactos se consultan en el SAS y pueden cambiar con una convocatoria.
- El proyecto no tiene relación institucional con el Servicio Andaluz de Salud.

## Arquitectura

- `index.html`: documento principal.
- `styles.css`: diseño responsive.
- `data.js`: 40 preguntas de práctica, fichas oficiales y claves de 2024/2025.
- `app.js`: navegación, motor de test, corrección, estadísticas, persistencia e importación.
- `manifest.webmanifest`, `sw.js`, `favicon.svg`: soporte instalable/PWA.
- `.github/workflows/deploy.yml`: tests y publicación GitHub Pages.
- `test-smoke.js`, `test-content.js`: pruebas automatizadas.
- `ejemplo_importacion_preguntas.json`: formato de carga del banco propio.

## Fuentes documentales

- [SAS: concurso-oposición 2025, Técnico Especialista Radiodiagnóstico](https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/profesionales/ofertas-de-empleo/oferta-de-empleo-publico-puestos-base/convocatorias-oep-2025/cuadro-de-evolucion/tecnicoa-especialista-en-radiodiagnostico)
- [SAS: concurso-oposición extraordinario 2024, centros SAS](https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/profesionales/ofertas-de-empleo/oferta-de-empleo-publico-puestos-base/oep-extraordinaria-decreto-ley-122022-centros-sas/cuadro-de-evolucion-concurso-oposicion-centros-sas/tecnicoa-especialista-en-radiodiagnostico)
- [SAS: catálogo de temarios](https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/profesionales/ofertas-de-empleo/oferta-de-empleo-publico-puestos-base/oferta-de-empleo-publico-temario-tecnico-especialista-en-radiodiagnostico)

