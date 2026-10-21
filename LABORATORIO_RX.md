# Laboratorio corporal 5.1 · Paula Master Edition

Catálogo de **1.000 ejercicios** independiente del banco general de 5.000 preguntas:

| Técnica | Ejercicios |
|---|---:|
| RX | 350 |
| TC | 300 |
| RM | 250 |
| Mamografía | 60 |
| DXA | 40 |

80 contextos gráficos, incluyendo el tórax original y 79 mapas nuevos. Se conserva la identidad de los 18 ejercicios iniciales. Hay objetivos de localización, identificación, técnica, orientación, proyecciones y secuencias. Los conceptos técnicos se presentan como preguntas; no se usan imágenes falsas para simular reconocimiento de secuencias.

Filtros por técnica, región, tipo y nivel; tandas de 10, 18, 25, 50 o 100; solo pendientes; repaso de fallos del laboratorio; estudio con pistas; examen con corrección al finalizar; historial y recuperación de borradores; ampliación del visor dentro de un área desplazable.

La selección mantiene una vuelta por combinación de filtros y no repite dentro de una tanda. La última tanda puede ser más corta para agotar los disponibles. Un ejercicio no se duplica por cambiar el tipo de respuesta: su objetivo corresponde a una estructura y vista concretas o a un concepto técnico. Se sustituyen equivalencias entre referencias RX de campos solapados.

**Naturaleza del material:** mapas topográficos originales y simplificados, no radiografías, TC, RM, mamografías ni mediciones DXA clínicas. Los colores no representan densidad ni señal. Algunos mapas regionales reúnen referencias de niveles próximos; no deben interpretarse como un único corte de un paciente. No hay casos de pacientes ni diagnósticos. Las fuentes enlazadas son de consulta y no implican validación experta ni aval del banco. Es material de práctica que requiere revisión especializada para uso formativo reglado.

Fuentes de consulta: OpenStax Anatomy & Physiology 2e; NIH/NIBIB sobre TC y RM; ACR/RSNA RadiologyInfo sobre mamografía, DXA y seguridad de RM; Medical Imaging Systems en NCBI Bookshelf; posiciones oficiales ISCD. Enlaces por ejercicio en modo estudio. Los textos son de redacción propia y los vectores son originales; no se redistribuyen imágenes clínicas de terceros.

`lab-atlas.js` contiene el catálogo explícito y los vectores. `build-lab-atlas.py` y `lab-technique-content.py` permiten regenerarlo; `LAB_ATLAS_INVENTARIO.json` facilita su revisión. Todos permanecen en la raíz.

Datos del navegador: se conserva la clave `radiosas_academy_v1`, los campos previos y los IDs. Se añaden `labSettings` y `labRotationV51`; los intentos y borradores anteriores continúan siendo legibles. No hay sincronización remota. Exportación/importación JSON incluye los campos nuevos sin sustituir el motor general.

Pruebas: `npm test` y `npm run test:browser`. La primera verifica las 1.000 respuestas y los centros táctiles con coordenadas escaladas. La segunda prueba Chromium y WebKit, un ejercicio de cada contexto gráfico, preguntas técnicas de las cinco modalidades, filtros, zoom, persistencia, historial y cinco viewports. El workflow impide el despliegue si falla una comprobación.
