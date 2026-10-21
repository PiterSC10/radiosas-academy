/* RADIOSAS Laboratorio RX: base didáctica original independiente del banco de 5000 preguntas.
 * Vista frontal del paciente: el lado derecho del paciente se representa a la izquierda de la imagen.
 * Localización aproximada en un esquema educativo; no usar para decisiones clínicas. */
window.RADIOSAS_LAB = Object.freeze({
  version: '5.0',
  image: 'rx-torax-esquema.svg',
  width: 700, height: 850,
  spots: [
    {id:'traquea',label:'Tráquea',x:351,y:196,r:37,explanation:'La tráquea se reconoce como una columna aérea central, habitualmente situada por delante de la columna vertebral. En esta ilustración aparece en el mediastino superior.'},
    {id:'clav-d',label:'Clavícula derecha',x:241,y:144,r:47,explanation:'La clavícula derecha del paciente aparece a la izquierda de la imagen frontal. Compara su posición con la clavícula contralateral.'},
    {id:'clav-i',label:'Clavícula izquierda',x:466,y:143,r:47,explanation:'La clavícula izquierda del paciente aparece a la derecha para quien observa la proyección frontal.'},
    {id:'vert-d',label:'Vértice pulmonar derecho',x:214,y:216,r:43,explanation:'El vértice pulmonar derecho se encuentra por encima de la primera costilla, cerca de la región clavicular.'},
    {id:'vert-i',label:'Vértice pulmonar izquierdo',x:502,y:213,r:43,explanation:'El vértice pulmonar izquierdo es la porción más superior del campo pulmonar del paciente, a la derecha del observador.'},
    {id:'pulmon-d',label:'Campo pulmonar derecho',x:215,y:434,r:70,explanation:'En la proyección frontal, el campo pulmonar derecho del paciente se representa a la izquierda del observador.'},
    {id:'pulmon-i',label:'Campo pulmonar izquierdo',x:516,y:430,r:69,explanation:'El campo pulmonar izquierdo del paciente se representa a la derecha del observador; parte de su región medial está próxima a la silueta cardíaca.'},
    {id:'hilio-d',label:'Hilio pulmonar derecho',x:300,y:375,r:40,explanation:'Los hilios son regiones centrales por las que entran y salen bronquios, vasos y otras estructuras; su evaluación real requiere una radiografía adecuada.'},
    {id:'hilio-i',label:'Hilio pulmonar izquierdo',x:430,y:373,r:41,explanation:'El hilio pulmonar izquierdo suele proyectarse algo más alto que el derecho en radiografías frontales normales.'},
    {id:'corazon',label:'Silueta cardíaca',x:422,y:530,r:70,explanation:'La silueta cardíaca se proyecta predominantemente hacia el lado izquierdo del paciente, a la derecha del observador.'},
    {id:'diafragma-d',label:'Hemidiafragma derecho',x:225,y:610,r:49,explanation:'El hemidiafragma derecho suele situarse ligeramente más alto que el izquierdo, en parte por la presencia del hígado.'},
    {id:'diafragma-i',label:'Hemidiafragma izquierdo',x:502,y:619,r:49,explanation:'El hemidiafragma izquierdo separa la cavidad torácica de la abdominal y puede asociarse a la burbuja gástrica subdiafragmática.'},
    {id:'vertebras',label:'Columna torácica',x:349,y:452,r:33,explanation:'Los cuerpos vertebrales torácicos aparecen en la línea media, por detrás del mediastino, con visibilidad variable según la técnica radiográfica.'},
    {id:'aorta',label:'Arco aórtico',x:426,y:252,r:35,explanation:'El botón o arco aórtico configura una parte del contorno mediastínico superior izquierdo del paciente.'},
    {id:'angulo-d',label:'Ángulo costofrénico derecho',x:113,y:644,r:38,explanation:'El ángulo costofrénico derecho es la zona donde el diafragma y la pared torácica forman un ángulo, visible lateralmente en la proyección frontal.'},
    {id:'angulo-i',label:'Ángulo costofrénico izquierdo',x:593,y:648,r:38,explanation:'El ángulo costofrénico izquierdo es el equivalente del derecho, situado al lado izquierdo del paciente.'},
    {id:'costillas-d',label:'Costillas derechas',x:154,y:325,r:43,explanation:'Las costillas se curvan alrededor de los campos pulmonares. Observa los arcos costales y su simetría.'},
    {id:'costillas-i',label:'Costillas izquierdas',x:557,y:327,r:42,explanation:'Las costillas izquierdas del paciente se representan a la derecha de la imagen frontal; las costillas posteriores pueden verse más horizontales.'}
  ]
});
