# RADIOSAS Academy 3.7 · Informe de banco de 5.000 preguntas

**Fecha:** 21 de octubre de 2026 · **Edición:** Paula Master Edition ♥

## Cantidad realmente integrada

La web carga efectivamente **5.000 preguntas de entrenamiento** mediante archivos JavaScript en la raíz:

- `data.js`: 100 preguntas iniciales.
- `bank-master.js`: 900 preguntas de la ampliación anterior.
- `bank-5000.js`: **4.000 preguntas nuevas y resueltas**, de las cuales **3.600** se crean a partir de **450 fichas de conceptos** con varios ejercicios por ficha, y **400** son ejercicios de cálculo con condiciones de caso.

Los 4.000 nuevos enunciados son literales distintos y mantienen identificadores únicos. **No representan 4.000 conceptos diferentes**: varias preguntas evalúan una misma ficha desde enfoques distintos (definición, relación correcta, relación incorrecta, interpretación o selección de término). Esta característica debe tenerse en cuenta para estudiar sin sobreinterpretar la cifra de 5.000.

## Materias

| Materia | Preguntas disponibles |
|:--|--:|
| Anatomía radiológica | 512 |
| Proyecciones radiográficas | 560 |
| Protección radiológica | 491 |
| Tomografía computarizada | 496 |
| Resonancia magnética | 471 |
| Física de rayos X | 494 |
| Legislación sanitaria | 500 |
| Medios de contraste | 524 |
| Sistemas de imagen | 479 |
| Mamografía y densitometría | 473 |
| **Total** | **5.000** |

## Controles realizados

- 5.000 IDs diferentes, 5.000 enunciados textuales distintos.
- 4 opciones no idénticas y un índice de respuesta válido por cada pregunta.
- Explicación almacenada con cada pregunta.
- Los **400 ejercicios de cálculo** han superado una **comprobación aritmética independiente** del generador, con tolerancia de redondeo, para 16 familias de fórmulas.
- 10 materias reconocidas por el menú de filtros.
- 25 tests rápidos consecutivos de 10 preguntas sin repetir ninguna, comprobados en ejecución automatizada.
- Las preguntas nuevas tienen prioridad sobre las ya utilizadas tras migrar del banco 3.6.
- La migración conserva todas las notas, respuestas, favoritos y sesiones anteriores en los datos locales de prueba.
- La nueva versión modifica solamente archivos de la web; mantiene la clave de almacenamiento `radiosas_academy_v1`.
- Comprobación de archivos en raíz, caché PWA, despliegue GitHub Actions y presencia de los iconos.

## Límites y advertencias

**No son preguntas oficiales del SAS.** Los exámenes oficiales y sus claves de respuesta disponibles en RADIOSAS se mantienen como una funcionalidad diferenciada. Sus enunciados todavía se consultan en los PDF originales.

**No hay revisión editorial sanitaria exhaustiva de cada pregunta.** La generación ha sido programática a partir de fichas existentes y fórmulas; las pruebas de software no sustituyen la validación de conceptos, distractores, legislación vigente y protocolos. Un profesional acreditado debe validar el banco antes de utilizarlo como único recurso de preparación de la oposición.

**El guardado es local.** Para evitar pérdidas, exportar datos en Configuración antes de actualizar. Usar siempre la misma dirección web y el mismo navegador. Safari puede eliminar datos locales o cambiar sus políticas.

## Instalación GitHub sin carpeta `assets`

Subir el **contenido descomprimido del ZIP** a la raíz del repositorio `PiterSC10/radiosas-academy`, incluyendo `bank-5000.js` y todas las imágenes en la misma carpeta que `index.html`. La única carpeta interna que se conserva es `.github/workflows/`, obligatoria para GitHub Actions. Seleccionar **Settings → Pages → Source: GitHub Actions** y verificar la ejecución en la pestaña Actions.
