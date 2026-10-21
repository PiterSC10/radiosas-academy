# RADIOSAS Academy · Actualizaciones seguras

La web se puede publicar de nuevo en GitHub Pages sin reiniciar los resultados de Paula.

## Antes de publicar otra versión

1. En la versión actual: Configuración → **Exportar datos JSON**. Guardar una copia fuera del navegador.
2. No cambiar el dominio, ruta base ni la clave `radiosas_academy_v1` de localStorage.
3. Mantener estables los `id` de las preguntas existentes. Si se añade una pregunta, crear un ID nuevo. Si se corrige una respuesta, revisar que las revisiones históricas guardan la clave en el intento original.
4. Añadir preguntas nuevas al banco, no reemplazar indiscriminadamente preguntas antiguas; conservar los scripts y recursos en la raíz. Respetar `.github/workflows`.
5. Actualizar la versión del caché en `sw.js` y ejecutar `npm test` antes de subir.
6. Publicar, recargar la web y comprobar que las notas antiguas siguen presentes y que el contador total/pending se ha actualizado.

## Qué se conserva y cómo se calculan las novedades

- Intentos finalizados, notas, respuestas y tiempos.
- Preguntas vistas (distintas), favoritos, plan semanal, temas estudiados e importaciones.
- Si pasan de 1.000 a 5.000 las preguntas, las 4.000 nuevas se incorporan sin modificar las estadísticas del historial. La prueba utiliza datos sintéticos y no significa que haya 5.000 preguntas disponibles en esta entrega.
- Al actualizar, se reconoce el cambio de IDs y se priorizan las preguntas nuevas en los test; las colas anteriores no se pierden.
- Los contadores de preguntas usadas incluyen las asignadas al iniciar un test, aunque este se abandone.

## Límites

El historial está en el almacenamiento local del **mismo navegador y origen web**. No existe aún servidor para sincronizar datos ni copia de seguridad automática en GitHub. Cambiar de móvil, borrar datos del navegador, visitar otra URL o restaurar una copia antigua puede impedir recuperar los últimos avances.

## Meta 5.000

A fecha de la versión 3.6, el banco contiene 1.000 preguntas reales de entrenamiento. Meta futura: 5.000. Se ensaya la actualización 1.000→5.000 con 4.000 objetos ficticios exclusivamente en `npm test` para verificar integridad de estadísticas; no se añaden como preguntas públicas.


## Actualización 3.7: de 1.000 a 5.000 integradas

- Añadido `bank-5000.js` con 4.000 enunciados diferentes y respuestas, sin cambiar `data.js` ni `bank-master.js`.
- Los 4.000 enunciados son variantes de fichas conceptuales y cálculos de entrenamiento; no se trata de 4.000 conceptos únicos ni de un cuestionario oficial SAS.
- Se mantienen identificadores anteriores (`p...` y `master-...`), clave de guardado, historial, favoritos y lista de preguntas ya presentadas.
- Se conserva la URL y las imágenes directamente en la raíz. Si la persona actualiza en el mismo navegador mantendrá las estadísticas.
- Antes de reemplazar los archivos, exportar una copia JSON desde la página Configuración.
