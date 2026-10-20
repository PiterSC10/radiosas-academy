/* Fuentes de las plantillas oficiales: SAS, 2025 y 2024. Letras revisadas frente a sus plantillas definitivas. */
window.RADIOSAS_DATA = (()=>{
 const key2025 = 'D D B B D D B C A D D B B B D B A C D B A D B D C D C C D D A D A D D D D C C A B C A D C C D C C D B A D D D D D D D C A D D B B A D B B C D C A C B'.split(' ').join('');
 const key2024 = 'A A B A C D A B C D D D B B D B D A B D B A D C B B C A A C C D A A B D A D D A A D C D A C D C C D A D A A B C B B D A B B D D B D D A C A D B B C D'.split(' ').join('');
 if(key2025.length!==75 || key2024.length!==75) throw Error('Error en plantilla oficial');
 const exams=[
  {year:2025, name:'SAS 2025 · Acceso libre',note:'Examen celebrado el 7 de junio de 2025',duration:120,answers:key2025, pdf:'https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/sites/default/files/sincfiles/wsas-media-mediafile_sasdocumento/2025/tecnicoa_especialista_en_radiodiagnostico_librepi.pdf',template:'https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/sites/default/files/sincfiles/wsas-media-mediafile_sasdocumento/2026/plant_teradiodiag_l.pdf'},
  {year:2024,name:'SAS 2024 · Acceso libre',note:'Convocatoria 2023, examen de 10 de febrero de 2024',duration:120,answers:key2024,pdf:'https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/sites/default/files/sincfiles/wsas-media-mediafile_sasdocumento/2024/20240210_55018_te_radiodiagnostico.pdf',template:'https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/sites/default/files/sincfiles/wsas-media-mediafile_sasdocumento/2024/def_teradiodiag_sas_2023.pdf'},
  {year:2022,name:'SAS 2022 · Acceso libre',note:'Documento oficial; plantilla todavía no integrada en esta versión',duration:0,answers:'',pdf:'https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/profesionales/ofertas-de-empleo/oferta-de-empleo-publico-puestos-base/convocatorias-oep-2021-22/cuadro-de-evolucion-de-acceso-libre/tecnicoa-especialista-en-radiodiagnostico-1',template:''}
 ];
 const themes=['Anatomía radiológica','Proyecciones radiográficas','Protección radiológica','Tomografía computarizada','Resonancia magnética','Física de rayos X','Legislación sanitaria','Medios de contraste','Sistemas de imagen','Mamografía y densitometría'];
 const raw=[
 ['Anatomía radiológica','¿Qué hueso contiene la cavidad glenoidea?','Escápula|Húmero|Clavícula|Esternón',0,'La cavidad glenoidea de la escápula articula con la cabeza del húmero.'],
 ['Anatomía radiológica','¿En qué hueso se encuentra el olécranon?','Radio|Cúbito|Húmero|Escápula',1,'El olécranon es la prominencia proximal del cúbito o ulna.'],
 ['Anatomía radiológica','¿En qué hueso se sitúa la apófisis mastoides?','Frontal|Etmoides|Temporal|Parietal',2,'La apófisis mastoides es parte del hueso temporal.'],
 ['Anatomía radiológica','¿Qué cavidad ósea articula con la cabeza femoral?','Acetábulo|Sacro|Foramen obturador|Cóndilo',0,'El acetábulo de la pelvis articula con la cabeza del fémur.'],
 ['Anatomía radiológica','¿Cuántas vértebras cervicales hay habitualmente?','5|6|7|8',2,'La columna cervical contiene habitualmente siete vértebras.'],
 ['Anatomía radiológica','¿Dónde se localiza la silla turca?','Etmoides|Esfenoides|Occipital|Temporal',1,'La silla turca es una depresión del cuerpo del esfenoides.'],
 ['Proyecciones radiográficas','¿Qué proyección es clásica para visualizar senos maxilares?','Waters|Towne|Löwenstein|Ferguson',0,'La proyección occipitomentoniana de Waters es clásica para senos paranasales.'],
 ['Proyecciones radiográficas','El método de Towne corresponde a una proyección de:','Pelvis|Cráneo|Muñeca|Tórax',1,'Towne es una proyección axial AP del cráneo.'],
 ['Proyecciones radiográficas','En radiografía de tórax en bipedestación suele preferirse la proyección:','AP|PA|Oblicua|Axial',1,'La proyección posteroanterior es la habitual cuando puede realizarse.'],
 ['Proyecciones radiográficas','En una radiografía lateral de tórax convencional suele apoyarse el costado:','Derecho|Izquierdo|Indistintamente|Ninguno',1,'La lateral izquierda reduce la magnificación de la silueta cardiaca.'],
 ['Protección radiológica','¿Qué unidad SI mide la dosis absorbida?','Sievert|Gray|Tesla|Becquerel',1,'El gray (Gy) expresa energía absorbida por unidad de masa.'],
 ['Protección radiológica','¿Qué unidad SI se utiliza para la dosis efectiva?','Gray|Tesla|Sievert|Becquerel',2,'El sievert (Sv) mide dosis equivalente y dosis efectiva.'],
 ['Protección radiológica','¿Qué unidad mide la actividad radiactiva?','Becquerel|Gray|Sievert|Tesla',0,'Un becquerel corresponde a una desintegración por segundo.'],
 ['Protección radiológica','Si se duplica la distancia a una fuente puntual ideal, su intensidad pasa a:','El doble|La mitad|Una cuarta parte|Cuatro veces',2,'Ley del inverso del cuadrado de la distancia: intensidad proporcional a 1/r².'],
 ['Protección radiológica','¿Qué indica el principio ALARA?','Dosis siempre máxima|Dosis tan baja como razonablemente posible|No realizar radiografías nunca|Dosis idéntica para todos',1,'ALARA es optimización de protección radiológica.'],
 ['Tomografía computarizada','¿Cuál es el valor aproximado del agua en la escala Hounsfield?','-1000 UH|0 UH|+500 UH|+1000 UH',1,'El agua se sitúa en torno a 0 unidades Hounsfield.'],
 ['Tomografía computarizada','El aire tiene aproximadamente el valor:','-1000 UH|0 UH|+100 UH|+1000 UH',0,'El aire se sitúa en torno a -1000 UH.'],
 ['Tomografía computarizada','¿Qué representa el pitch en TC helicoidal?','Grosor del vidrio|Avance de mesa por giro dividido por colimación total|Voltaje|FOV',1,'El pitch relaciona desplazamiento de mesa y anchura total colimada.'],
 ['Tomografía computarizada','¿Qué representa un vóxel en una imagen tomográfica?','Elemento de volumen|Elemento exclusivamente bidimensional|Una bobina|Un fotón',0,'El vóxel representa un pequeño volumen de la imagen.'],
 ['Tomografía computarizada','Un implante metálico puede producir en TC artefactos de:','Estrías|Solo cambios de color|Ausencia de ruido|Ningún tipo',0,'El metal puede producir estrías por endurecimiento del haz y falta de fotones.'],
 ['Resonancia magnética','¿Qué técnica no emplea radiación ionizante?','TC|Resonancia magnética|Radiografía|Mamografía',1,'La resonancia usa campos magnéticos y radiofrecuencia.'],
 ['Resonancia magnética','En RM ponderada en T2 convencional el líquido libre suele verse:','Oscuro|Brillante|Inexistente|Calcificado',1,'El líquido habitualmente aparece hiperintenso en T2.'],
 ['Resonancia magnética','¿Qué significa TR en RM?','Tiempo de repetición|Tiempo de radiación|Tasa de rotación|Tiempo de recorte',0,'TR es el tiempo de repetición entre pulsos de excitación.'],
 ['Resonancia magnética','¿Qué significa TE en RM?','Tiempo de exposición|Tiempo de eco|Temperatura de emisión|Tiempo eléctrico',1,'TE es el intervalo desde excitación hasta el eco medido.'],
 ['Resonancia magnética','¿En qué unidad se mide la intensidad del campo magnético?','Gray|Tesla|Sievert|UH',1,'La intensidad del campo magnético se expresa en teslas.'],
 ['Física de rayos X','¿Qué expresa kVp en radiografía?','Tiempo de exploración|Tensión máxima del tubo|Dosis efectiva|Actividad radiactiva',1,'kVp significa kilovoltaje pico del tubo de rayos X.'],
 ['Física de rayos X','¿Qué unidad corresponde al producto corriente-tiempo del tubo?','mAs|Tesla|UH|Bq',0,'Los mAs son mA multiplicados por segundos.'],
 ['Física de rayos X','¿Qué radiación emplea una radiografía convencional?','Ultrasonidos|Rayos X|Luz visible|Ondas de radio exclusivamente',1,'La radiografía se basa en rayos X.'],
 ['Legislación sanitaria','¿En qué año se aprobó el Estatuto de Autonomía andaluz vigente?','1978|1981|2007|2014',2,'El Estatuto vigente es la Ley Orgánica 2/2007.'],
 ['Legislación sanitaria','¿Qué artículo de la Constitución proclama la igualdad ante la ley?','14|27|43|149',0,'El artículo 14 de la Constitución proclama la igualdad ante la ley.'],
 ['Legislación sanitaria','¿Qué ley regula la autonomía del paciente?','Ley 41/2002|Ley 31/1995|Ley 55/2003|Ley 39/2015',0,'La Ley 41/2002 regula información, consentimiento y documentación clínica.'],
 ['Legislación sanitaria','¿Puede revocarse el consentimiento informado según la Ley 41/2002?','No|Sí, libremente y por escrito|Solo judicialmente|Solo tras el alta',1,'La ley permite revocarlo libremente por escrito.'],
 ['Medios de contraste','¿Qué contraste es habitual en TC?','Yodado|Gadolinio siempre|Helio|Plomo',0,'Los contrastes yodados son habituales en tomografía computarizada.'],
 ['Medios de contraste','¿Qué familia de contrastes se emplea habitualmente en RM?','Bario|Gadolinio|Yodo siempre|Plomo',1,'La RM utiliza agentes basados en gadolinio según indicación.'],
 ['Medios de contraste','Antes de administrar contraste es correcto:','Ignorar los antecedentes|Comprobar identidad, antecedentes y protocolo|Omitir la identificación|Ignorar la indicación',1,'La seguridad obliga a confirmar la identificación y posibles riesgos.'],
 ['Sistemas de imagen','¿Qué significan las siglas PACS?','Picture Archiving and Communication System|Patient Annual Clinical Score|Physical Atomic Control System|Protocol Archiving Clinical Standard',0,'PACS permite el archivo y comunicación de imágenes médicas.'],
 ['Sistemas de imagen','¿Qué estándar facilita la interoperabilidad de imágenes médicas?','DICOM|MP3|CSS|SMTP',0,'DICOM estandariza imágenes e información asociada.'],
 ['Sistemas de imagen','¿Qué significa RIS?','Radiology Information System|Radioisotope Imaging Sensor|Radiation Inspection Sequence|Remote Image Scaling',0,'RIS es un sistema de información de radiología.'],
 ['Mamografía y densitometría','¿Cuáles son dos proyecciones habituales en mamografía de cribado?','Craneocaudal y mediolateral oblicua|Towne y Waters|AP y axial de cráneo|Waters y Caldwell',0,'Las proyecciones CC y MLO son las estándar.'],
 ['Mamografía y densitometría','¿Qué técnica se utiliza para evaluar densidad mineral ósea?','DXA|RM funcional|Fluoroscopia continua|PET cerebral',0,'DXA es absorciometría de rayos X de doble energía.']
 ];
 const practice=raw.map((r,i)=>({id:'p'+(i+1),category:r[0],text:r[1],options:r[2].split('|'),answer:r[3],explanation:r[4]}));
 return {exams,themes,practice,temarioURL:'https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/profesionales/ofertas-de-empleo/oferta-de-empleo-publico-puestos-base/oferta-de-empleo-publico-temario-tecnico-especialista-en-radiodiagnostico'};
})();
