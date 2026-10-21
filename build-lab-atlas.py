"""Build a root-only educational atlas. No patient images or diagnostic cases.
Each objective is (technique, anatomical view, structure), not a reworded duplicate.
"""
import json, math, unicodedata, re
from pathlib import Path

def slug(s):
 return re.sub('-+','-',''.join(c.lower() if c.isalnum() else '-' for c in unicodedata.normalize('NFKD',s) if not unicodedata.combining(c))).strip('-')
SOURCES={
 'upper':{'title':'OpenStax · Huesos del miembro superior','url':'https://openstax.org/books/anatomy-and-physiology-2e/pages/8-2-bones-of-the-upper-limb'},
 'lower':{'title':'OpenStax · Huesos del miembro inferior','url':'https://openstax.org/books/anatomy-and-physiology-2e/pages/8-4-bones-of-the-lower-limb'},
 'axial':{'title':'OpenStax · Esqueleto axial','url':'https://openstax.org/books/anatomy-and-physiology-2e/pages/7-introduction'},
 'ct':{'title':'NIH/NIBIB · Tomografía computarizada','url':'https://www.nibib.nih.gov/science-education/science-topics/computed-tomography-ct'},
 'mr':{'title':'NIH/NIBIB · Resonancia magnética','url':'https://www.nibib.nih.gov/science-education/science-topics/magnetic-resonance-imaging-mri'},
 'mammo':{'title':'ACR/RSNA · Mamografía','url':'https://www.radiologyinfo.org/en/info/mammo'},
 'dxa':{'title':'ACR/RSNA · Densitometría ósea','url':'https://www.radiologyinfo.org/en/info/dexa'},
 'anatomy':{'title':'OpenStax · Anatomía y fisiología 2e','url':'https://openstax.org/books/anatomy-and-physiology-2e/pages/1-introduction'}
}
atlases=[]; questions=[]
def node(label,x,y,kind='organ',rx=30,ry=22,note=''):
 return dict(label=label,x=x,y=y,kind=kind,rx=rx,ry=ry,note=note)
def add(mod,region,title,view,nodes,outline='body',source='anatomy',limit=None):
 aid=slug(mod+' '+title+' '+view)
 assert all(40<=n['x']<=660 and 80<=n['y']<=770 for n in nodes),title
 atlas=dict(id=aid,technique=mod,region=region,title=title,view=view,nodes=nodes,outline=outline,source=source,width=700,height=850)
 atlases.append(atlas)
 for j,n in enumerate(nodes[:limit]):
  ident=aid+'--'+slug(n['label'])
  questions.append(dict(id=ident,atlas=aid,technique=mod,region=region,view=view,type='Localización' if j%2==0 else 'Identificación',difficulty='Básico' if n['kind'] in ['bone','organ'] else 'Intermedio',target=slug(n['label']),label=n['label'],x=n['x'],y=n['y'],r=min(38,max(18,min(n['rx'],n['ry'])+8)),explanation=n['note'] or f"{n['label']}: referencia anatómica de {title.lower()} en la vista {view.lower()}. El dibujo resume su localización; no representa densidad ni señal de una imagen clínica.",source=source,objective=mod+'|'+title+'|'+view+'|'+n['label']))
 return atlas
# RX — hands and feet: every phalanx and metapodial is a different structure.
def hand(oblique=False):
 ns=[]
 carpals=[('Escafoides',250,570),('Semilunar',330,580),('Piramidal',410,580),('Pisiforme',464,600),('Trapecio',213,515),('Trapezoide',290,515),('Grande',370,510),('Ganchoso',450,520)]
 for name,x,y in carpals:ns.append(node(name,x,y,'bone',30,25,'Hueso del carpo; identifica su posición respecto a las filas proximal y distal.'))
 for d in range(1,6):
  x=140+(d-1)*105;tip=190+abs(3-d)*25
  if d==1:
   ns.extend([node('Metacarpiano I',145,500,'bone',26,55,'Metacarpiano del pulgar.'),node('Falange proximal del pulgar',104,407,'bone',25,36),node('Falange distal del pulgar',83,330,'bone',23,30)])
  else:
   ns.append(node(f'Metacarpiano {d}',x,445,'bone',25,63))
   for part,y in [('proximal',330),('media',255),('distal',tip-30)]:ns.append(node(f'Falange {part} del dedo {d}',x,y,'bone',24,28))
 if oblique:
  for n in ns:n['x']=round(350+(n['x']-350)*.75+(580-n['y'])*.18);n['y']=round(n['y']+(n['x']-350)*.13)
 return ns
for v,o in [('PA',False),('Oblicua',True)]:add('RX','Miembro superior','Mano derecha',v,hand(o),'hand','upper')
def foot(oblique=False):
 ns=[node('Calcáneo',360,650,'bone',65,65),node('Astrágalo',360,545,'bone',50,40),node('Navicular',285,470,'bone',45,30),node('Cuboides',470,490,'bone',42,34),node('Cuneiforme medial',220,405,'bone',30,30),node('Cuneiforme intermedio',295,405,'bone',28,28),node('Cuneiforme lateral',370,410,'bone',28,28)]
 for d in range(1,6):
  x=155+d*73;y0=320+(d-1)*17
  ns.append(node(f'Metatarsiano {d}',x,y0,'bone',22,53))
  for part,off in [('proximal',100),('media',155),('distal',205)]:
   if d==1 and part=='media':continue
   ns.append(node(f'Falange {part} del dedo {d} del pie',x,y0-off,'bone',20,20))
 if oblique:
  for n in ns:n['x']=round(350+(n['x']-350)*.8+(650-n['y'])*.14)
 return ns
for v,o in [('Dorsoplantar',False),('Oblicua',True)]:add('RX','Miembro inferior','Pie derecho',v,foot(o),'foot','lower')
# Named landmarks provide objectives different from simply naming the whole bone.
def points(spec):
 out=[]
 for row in spec:
  name,x,y,*more=row
  out.append(node(name,x,y,*more))
 return out
RX_MAPS=[
('Miembro superior','Hombro','AP','shoulder',[
('Cabeza humeral',430,370,'bone',65,70),('Cuello anatómico humeral',465,440,'landmark',35,25),('Cuello quirúrgico humeral',430,505,'landmark',36,24),('Tubérculo mayor',515,360,'landmark',28,35),('Tubérculo menor',460,400,'landmark',23,24),('Diáfisis humeral',430,635,'bone',33,85),('Cavidad glenoidea',350,360,'landmark',20,40),('Acromion',365,265,'bone',40,22),('Apófisis coracoides',330,315,'bone',22,22),('Clavícula distal',290,230,'bone',65,20),('Cuerpo de la escápula',240,480,'bone',65,90),('Articulación acromioclavicular',325,240,'space',17,20)]),
('Miembro superior','Escápula','Lateral en Y','shouldery',[
('Espina de la escápula',270,330,'bone',60,22),('Acromion escapular',390,255,'bone',50,22),('Coracoides escapular',450,335,'bone',40,25),('Cuerpo escapular lateral',350,560,'bone',30,90),('Ángulo inferior escapular',350,695,'landmark',24,25),('Glenoides en perfil',390,400,'space',20,28),('Borde lateral escapular',390,545,'bone',20,50),('Borde medial escapular',305,540,'bone',18,50)]),
('Miembro superior','Codo','AP','elbow',[
('Tróclea humeral',380,360,'landmark',35,26),('Capítulo humeral',275,360,'landmark',32,26),('Epicóndilo lateral',220,320,'landmark',23,25),('Epicóndilo medial',445,320,'landmark',24,25),('Cabeza radial',250,435,'bone',40,22),('Cuello radial',250,500,'landmark',22,28),('Tuberosidad radial',285,550,'landmark',22,25),('Olécranon',380,415,'bone',28,28),('Apófisis coronoides cubital',340,465,'bone',25,25),('Escotadura troclear',380,445,'space',22,22),('Diáfisis proximal del radio',235,650,'bone',24,65),('Diáfisis proximal del cúbito',380,650,'bone',25,65)]),
('Miembro superior','Codo','Lateral','elbowlat',[
('Olécranon en perfil',450,405,'bone',35,30),('Apófisis coronoides en perfil',345,435,'bone',30,25),('Escotadura troclear en perfil',385,400,'space',25,23),('Cabeza radial en perfil',320,480,'bone',34,22),('Cuello radial en perfil',330,535,'landmark',25,25),('Fosa olecraniana',410,335,'space',25,25),('Húmero distal lateral',390,255,'bone',35,60),('Cúbito proximal lateral',455,525,'bone',30,50),('Radio proximal lateral',350,635,'bone',25,55),('Interlínea humerorradial',320,435,'space',28,18)]),
('Pelvis y cadera','Pelvis','AP','pelvis',[
('Cresta ilíaca derecha',155,210,'bone',60,30),('Cresta ilíaca izquierda',545,210,'bone',60,30),('Ala ilíaca derecha',190,310,'bone',68,65),('Ala ilíaca izquierda',510,310,'bone',68,65),('Sacro',350,290,'bone',52,65),('Articulación sacroilíaca derecha',285,320,'space',18,45),('Articulación sacroilíaca izquierda',415,320,'space',18,45),('Acetábulo derecho',205,460,'space',40,40),('Acetábulo izquierdo',495,460,'space',40,40),('Sínfisis púbica',350,560,'space',20,28),('Agujero obturador derecho',265,535,'space',38,35),('Agujero obturador izquierdo',435,535,'space',38,35),('Tuberosidad isquiática derecha',215,610,'bone',32,25),('Tuberosidad isquiática izquierda',485,610,'bone',32,25),('Cóccix',350,420,'bone',20,32)]),
('Pelvis y cadera','Fémur proximal','AP','hip',[
('Cabeza femoral',300,250,'bone',62,60),('Cuello femoral',405,345,'bone',55,30),('Trocánter mayor',520,320,'bone',35,48),('Trocánter menor',420,465,'bone',24,26),('Región intertrocantérica',470,405,'bone',40,40),('Diáfisis femoral proximal',500,640,'bone',40,80),('Fóvea de la cabeza femoral',265,245,'landmark',18,18),('Cortical medial del fémur',455,580,'bone',18,40)]),
('Miembro inferior','Rodilla','AP','knee',[
('Cóndilo femoral medial',430,345,'bone',58,40),('Cóndilo femoral lateral',255,345,'bone',58,40),('Escotadura intercondílea',350,355,'space',22,30),('Meseta tibial medial',430,455,'bone',52,24),('Meseta tibial lateral',265,455,'bone',52,24),('Eminencia intercondílea',350,425,'bone',22,22),('Cabeza del peroné',155,500,'bone',28,30),('Cuello del peroné',155,565,'bone',20,25),('Tuberosidad tibial',350,535,'bone',27,27),('Diáfisis tibial proximal',350,650,'bone',37,70),('Interlínea femorotibial medial',430,405,'space',40,18),('Interlínea femorotibial lateral',260,405,'space',40,18)]),
('Miembro inferior','Rodilla','Lateral','kneelat',[
('Rótula',215,335,'bone',38,54),('Tróclea femoral en perfil',290,350,'bone',30,42),('Cóndilos femorales superpuestos',410,380,'bone',63,57),('Meseta tibial en perfil',390,490,'bone',75,20),('Tuberosidad tibial en perfil',285,560,'bone',25,28),('Cabeza fibular en perfil',480,525,'bone',30,25),('Espacio femoropatelar',265,365,'space',17,30),('Diáfisis distal femoral',395,225,'bone',40,55),('Diáfisis proximal tibial lateral',390,650,'bone',40,60),('Polo superior de la rótula',210,275,'landmark',22,20)]),
('Miembro inferior','Tobillo','AP','ankle',[
('Maléolo medial',425,440,'bone',25,40),('Maléolo lateral',230,480,'bone',25,45),('Cúpula astragalina',345,470,'bone',55,27),('Plafón tibial',345,405,'bone',55,20),('Diáfisis tibial distal',350,260,'bone',43,75),('Peroné distal',225,300,'bone',22,75),('Interlínea tibiotalar',345,435,'space',40,16),('Sindesmosis distal',270,365,'space',18,30),('Cuerpo del astrágalo',350,545,'bone',50,40),('Calcáneo en AP',350,675,'bone',55,45)]),
('Miembro inferior','Tobillo','Lateral','anklelat',[
('Tibia distal en perfil',345,275,'bone',42,65),('Astrágalo en perfil',345,445,'bone',60,40),('Cuello del astrágalo',435,480,'bone',35,23),('Cabeza del astrágalo',485,485,'bone',35,32),('Calcáneo en perfil',260,590,'bone',95,60),('Tuberosidad posterior del calcáneo',145,590,'bone',35,40),('Sustentáculo del astrágalo',315,535,'bone',25,20),('Navicular en perfil',540,515,'bone',28,35),('Articulación subtalar',300,505,'space',35,17),('Articulación talonavicular',495,510,'space',17,24)]),
('Cráneo y cara','Cráneo','Frontal','skull',[
('Hueso frontal',350,180,'bone',90,45),('Órbita derecha',230,340,'space',60,45),('Órbita izquierda',470,340,'space',60,45),('Seno frontal derecho',285,265,'space',35,25),('Seno frontal izquierdo',415,265,'space',35,25),('Tabique nasal óseo',350,400,'bone',15,40),('Maxilar derecho',260,485,'bone',48,37),('Maxilar izquierdo',440,485,'bone',48,37),('Cuerpo mandibular',350,630,'bone',70,27),('Rama mandibular derecha',180,560,'bone',22,50),('Rama mandibular izquierda',520,560,'bone',22,50),('Arco cigomático derecho',145,410,'bone',25,25),('Arco cigomático izquierdo',555,410,'bone',25,25)]),
('Cráneo y cara','Cráneo','Lateral','skulllat',[
('Frontal en perfil',455,200,'bone',55,35),('Parietal en perfil',290,170,'bone',65,35),('Occipital en perfil',155,350,'bone',30,65),('Temporal en perfil',300,390,'bone',50,40),('Silla turca',380,355,'landmark',25,20),('Dorso de la silla',355,350,'landmark',17,18),('Seno esfenoidal',420,385,'space',28,22),('Seno frontal lateral',515,280,'space',24,25),('Maxilar en perfil',515,470,'bone',32,40),('Mandíbula en perfil',420,600,'bone',65,24),('Cóndilo mandibular',315,470,'bone',25,24),('Apófisis mastoides',260,460,'bone',24,32),('Huesos nasales',565,360,'bone',20,24)]),
]
for region,title,view,outline,rows in RX_MAPS:add('RX',region,title,view,points(rows),outline,'upper' if region=='Miembro superior' else 'lower' if region=='Miembro inferior' or region=='Pelvis y cadera' else 'axial')
# Vertebral levels: AP and profile require different spatial identification.
for title,prefix,count,region in [('Columna cervical','C',7,'Columna'),('Columna torácica','T',12,'Columna'),('Columna lumbar','L',5,'Columna')]:
 for view in ['AP','Lateral']:
  ns=[]
  for i in range(count):
   y=150+i*540/max(count-1,1)
   ns.append(node(prefix+str(i+1),340 if view=='AP' else 280,y,'bone',65 if view=='AP' else 55,20 if count>7 else 30,f'Vertebra {prefix}{i+1}: nivel {i+1} de la región {title.lower()}. Se cuenta de craneal a caudal.'))
  add('RX',region,title,view,ns,'spinefront' if view=='AP' else 'spinelateral','axial')
# Complete RX with specific long-bone landmarks, not alternative wordings.
for title,names,region in [
 ('Húmero',['Cabeza','Tubérculo mayor','Cuello quirúrgico','Diáfisis proximal','Diáfisis media','Diáfisis distal','Epicóndilo medial','Epicóndilo lateral'],'Miembro superior'),
 ('Antebrazo',['Cabeza radial','Tuberosidad radial','Diáfisis radial','Estiloides radial','Olécranon','Diáfisis cubital','Cabeza cubital','Estiloides cubital'],'Miembro superior'),
 ('Pierna',['Cóndilo tibial medial','Cóndilo tibial lateral','Tuberosidad tibial','Cresta tibial','Diáfisis tibial','Maléolo medial','Cabeza fibular','Diáfisis fibular','Maléolo lateral'],'Miembro inferior')]:
 for view in ['AP','Lateral']:
  coords={'Húmero':[(310,155),(425,195),(350,275),(350,370),(350,470),(350,570),(445,675),(255,675)],'Antebrazo':[(250,180),(280,260),(250,430),(210,690),(440,140),(440,430),(440,645),(480,700)],'Pierna':[(445,160),(315,160),(380,240),(380,350),(380,460),(450,695),(205,230),(205,465),(190,735)]}[title]
  ns=[node(name+' · '+title,x+(25 if view=='Lateral' and i%2 else 0),y,'bone',26,30) for i,(name,(x,y)) in enumerate(zip(names,coords))]
  add('RX',region,title,view,ns,'longbone','upper' if region=='Miembro superior' else 'lower')
# Adopt the original 18 RX objectives and IDs unchanged, then select an explicit unique curriculum.
legacy_count=18
rx=[q for q in questions if q['technique']=='RX'];print('RX candidates',len(rx))
# The original module contributes 18, so the expansion supplies 332 RX objectives.
rx_keep=set(q['id'] for q in rx[:332]);questions=[q for q in questions if q['technique']!='RX' or q['id'] in rx_keep]
# CT sectional maps: nodes are authored for each level; no reused chest X-ray image.
CT=[]
def ct(title,region,view,rows):CT.append((title,region,view,rows))
ct('Encéfalo · ganglios basales','Cráneo y cara','Axial',[
('Lóbulo frontal derecho',240,210),('Lóbulo frontal izquierdo',460,210),('Núcleo caudado derecho',305,335),('Núcleo caudado izquierdo',395,335),('Putamen derecho',230,390),('Putamen izquierdo',470,390),('Tálamo derecho',305,455),('Tálamo izquierdo',395,455),('Tercer ventrículo',350,425),('Ventrículo lateral derecho',310,290),('Ventrículo lateral izquierdo',390,290),('Lóbulo occipital derecho',250,625),('Lóbulo occipital izquierdo',450,625),('Hoz cerebral',350,180),('Cráneo derecho',110,420)])
ct('Encéfalo · fosa posterior','Cráneo y cara','Axial',[
('Hemisferio cerebeloso derecho',250,555),('Hemisferio cerebeloso izquierdo',450,555),('Vermis cerebeloso',350,580),('Puente',350,405),('Cuarto ventrículo',350,485),('Peñasco temporal derecho',160,410),('Peñasco temporal izquierdo',540,410),('Lóbulo temporal derecho',220,290),('Lóbulo temporal izquierdo',480,290),('Clivus',350,315),('Seno esfenoidal',350,235),('Órbita derecha',230,165),('Órbita izquierda',470,165),('Celdillas mastoideas derechas',150,500),('Celdillas mastoideas izquierdas',550,500)])
ct('Cuello · región tiroidea','Cuello','Axial',[
('Tráquea cervical',350,345),('Esófago cervical',365,445),('Lóbulo tiroideo derecho',260,345),('Lóbulo tiroideo izquierdo',440,345),('Carótida común derecha',205,410),('Carótida común izquierda',495,410),('Yugular interna derecha',150,380),('Yugular interna izquierda',550,380),('Esternocleidomastoideo derecho',165,275),('Esternocleidomastoideo izquierdo',535,275),('Cuerpo vertebral cervical',350,550),('Canal vertebral cervical',350,625),('Músculo largo del cuello derecho',300,485),('Músculo largo del cuello izquierdo',400,485),('Apófisis espinosa cervical',350,710)])
ct('Tórax · arco aórtico','Tórax','Axial',[
('Pulmón derecho superior',185,375),('Pulmón izquierdo superior',515,375),('Arco aórtico',425,340),('Tráquea torácica',350,370),('Esófago torácico superior',370,460),('Vena cava superior',270,300),('Esternón superior',350,160),('Cuerpo vertebral torácico alto',350,580),('Canal torácico alto',350,650),('Escápula derecha en tórax superior',130,555),('Escápula izquierda en tórax superior',570,555),('Pectoral derecho',220,205),('Pectoral izquierdo',480,205),('Costilla derecha lateral',80,420),('Costilla izquierda lateral',620,420)])
ct('Tórax · bifurcación traqueal','Tórax','Axial',[
('Bronquio principal derecho',300,370),('Bronquio principal izquierdo',410,370),('Carina',350,325),('Arteria pulmonar derecha',290,300),('Arteria pulmonar izquierda',450,300),('Aorta ascendente',350,230),('Aorta descendente torácica',440,535),('Vena ácigos',290,510),('Esófago subcarinal',355,465),('Pulmón derecho a nivel hiliar',170,400),('Pulmón izquierdo a nivel hiliar',535,400),('Cuerpo vertebral a nivel hiliar',350,600),('Esternón medio',350,145),('Costilla posterior derecha',150,610),('Costilla posterior izquierda',550,610)])
ct('Tórax · corazón','Tórax','Axial',[
('Ventrículo derecho',320,295),('Ventrículo izquierdo',445,375),('Aurícula derecha',250,395),('Aurícula izquierda',380,470),('Tabique interventricular',390,345),('Aorta torácica descendente',465,575),('Esófago retrocardíaco',370,550),('Pulmón derecho basal',160,440),('Pulmón izquierdo basal',555,450),('Esternón inferior',350,160),('Vértebra torácica inferior',350,645),('Canal vertebral torácico inferior',350,720),('Pared torácica derecha',85,385),('Pared torácica izquierda',615,385),('Pericardio anterior',385,230)])
ct('Abdomen · hígado y bazo','Abdomen','Axial',[
('Lóbulo hepático derecho',195,325),('Lóbulo hepático izquierdo',330,230),('Bazo',530,360),('Estómago',440,290),('Aorta abdominal superior',375,500),('Vena cava inferior superior',300,470),('Glándula suprarrenal derecha',255,500),('Glándula suprarrenal izquierda',465,490),('Pilar diafragmático derecho',320,545),('Pilar diafragmático izquierdo',425,545),('Cuerpo vertebral lumbar alto',350,620),('Canal lumbar alto',350,700),('Pared abdominal anterior derecha',220,150),('Pared abdominal anterior izquierda',480,150),('Columna muscular paravertebral derecha',240,680)])
ct('Abdomen · hilios renales','Abdomen','Axial',[
('Riñón derecho',195,465),('Riñón izquierdo',510,435),('Pelvis renal derecha',250,450),('Pelvis renal izquierda',455,420),('Aorta infrarrenal',375,490),('Vena cava inferior infrarrenal',300,490),('Páncreas',350,310),('Duodeno',245,345),('Colon ascendente',130,340),('Colon descendente',575,340),('Psoas derecho',260,580),('Psoas izquierdo',440,580),('Cuerpo vertebral lumbar medio',350,620),('Recto abdominal derecho',290,170),('Recto abdominal izquierdo',410,170)])
ct('Abdomen · mesenterio','Abdomen','Axial',[
('Arteria mesentérica superior',375,355),('Vena mesentérica superior',320,355),('Yeyuno',460,290),('Íleon',260,330),('Mesenterio',350,410),('Colon ascendente infrarrenal',140,425),('Colon descendente infrarrenal',560,425),('Aorta lumbar inferior',380,525),('Vena cava lumbar inferior',305,525),('Psoas mayor derecho inferior',255,600),('Psoas mayor izquierdo inferior',445,600),('Cuerpo vertebral lumbar inferior',350,645),('Canal lumbar inferior',350,720),('Oblicuo externo derecho',100,300),('Oblicuo externo izquierdo',600,300)])
ct('Pelvis · estrecho superior','Pelvis y cadera','Axial',[
('Ala ilíaca derecha seccional',155,400),('Ala ilíaca izquierda seccional',545,400),('Sacro superior seccional',350,590),('Músculo ilíaco derecho',220,370),('Músculo ilíaco izquierdo',480,370),('Psoas derecho pélvico',265,460),('Psoas izquierdo pélvico',435,460),('Arteria ilíaca común derecha',280,535),('Arteria ilíaca común izquierda',420,535),('Colon sigmoide',465,270),('Asas ileales pélvicas',300,285),('Recto superior',350,490),('Glúteo mayor derecho superior',170,650),('Glúteo mayor izquierdo superior',530,650),('Canal sacro',350,680)])
ct('Pelvis · acetábulos','Pelvis y cadera','Axial',[
('Cabeza femoral derecha seccional',180,430),('Cabeza femoral izquierda seccional',520,430),('Acetábulo derecho seccional',230,470),('Acetábulo izquierdo seccional',470,470),('Vejiga',350,260),('Recto medio',350,510),('Obturador interno derecho',265,405),('Obturador interno izquierdo',435,405),('Glúteo medio derecho',100,490),('Glúteo medio izquierdo',600,490),('Glúteo mayor derecho',180,625),('Glúteo mayor izquierdo',520,625),('Sacro medio',350,650),('Pubis derecho seccional',285,185),('Pubis izquierdo seccional',415,185)])
ct('Senos paranasales','Cráneo y cara','Coronal',[
('Seno maxilar derecho',225,485),('Seno maxilar izquierdo',475,485),('Celdillas etmoidales derechas',300,345),('Celdillas etmoidales izquierdas',400,345),('Tabique nasal',350,460),('Cornete inferior derecho',305,505),('Cornete inferior izquierdo',395,505),('Cornete medio derecho',310,425),('Cornete medio izquierdo',390,425),('Órbita derecha coronal',205,310),('Órbita izquierda coronal',495,310),('Paladar duro',350,590),('Seno frontal derecho coronal',285,195),('Seno frontal izquierdo coronal',415,195),('Crista galli',350,300)])
ct('Columna lumbar · vértebra','Columna','Axial',[
('Cuerpo vertebral lumbar',350,320),('Pedículo derecho',280,430),('Pedículo izquierdo',420,430),('Lámina derecha',295,525),('Lámina izquierda',405,525),('Apófisis espinosa lumbar',350,625),('Apófisis transversa derecha',180,435),('Apófisis transversa izquierda',520,435),('Canal vertebral lumbar',350,475),('Faceta articular derecha',250,505),('Faceta articular izquierda',450,505),('Psoas mayor derecho seccional',185,315),('Psoas mayor izquierdo seccional',515,315),('Multífido derecho',255,630),('Multífido izquierdo',445,630)])
ct('Columna cervical · vértebra','Columna','Axial',[
('Cuerpo cervical seccional',350,300),('Foramen transverso derecho',245,375),('Foramen transverso izquierdo',455,375),('Canal cervical seccional',350,450),('Pedículo cervical derecho',295,390),('Pedículo cervical izquierdo',405,390),('Lámina cervical derecha',290,510),('Lámina cervical izquierda',410,510),('Apófisis espinosa bífida',350,600),('Carótida derecha cervical',170,270),('Carótida izquierda cervical',530,270),('Músculo largo del cuello derecho seccional',295,230),('Músculo largo del cuello izquierdo seccional',405,230),('Músculo paravertebral cervical derecho',225,590),('Músculo paravertebral cervical izquierdo',475,590)])
# Two different sectional planes of thorax/abdomen, explicitly regional reconstructions.
ct('Tórax · reconstrucción anterior','Tórax','Coronal',[
('Ápice pulmonar derecho coronal',205,180),('Ápice pulmonar izquierdo coronal',495,180),('Bronquio derecho coronal',290,350),('Bronquio izquierdo coronal',410,350),('Tráquea coronal',350,230),('Ventrículo izquierdo coronal',425,510),('Aurícula derecha coronal',295,480),('Hemidiafragma derecho coronal',205,625),('Hemidiafragma izquierdo coronal',505,660),('Seno costofrénico derecho coronal',110,670),('Seno costofrénico izquierdo coronal',590,700),('Hilio derecho coronal',250,410),('Hilio izquierdo coronal',450,390),('Aorta ascendente coronal',375,315),('Pulmón derecho medio coronal',190,440)])
ct('Abdomen · reconstrucción visceral','Abdomen','Coronal',[
('Hígado coronal',190,240),('Bazo coronal',535,250),('Estómago coronal',430,240),('Riñón derecho coronal',225,420),('Riñón izquierdo coronal',485,390),('Uréter derecho coronal',260,580),('Uréter izquierdo coronal',440,580),('Vejiga coronal',350,700),('Colon ascendente coronal',130,470),('Colon descendente coronal',570,470),('Colon transverso coronal',350,380),('Aorta abdominal coronal',365,480),('Vena cava inferior coronal',315,480),('Psoas derecho coronal',290,580),('Psoas izquierdo coronal',410,580)])
# Four regional skeletal CT maps with sectional bone/soft-tissue relationships.
for title,region,rows in [
('Muslo medio','Miembro inferior',[('Fémur',350,425),('Cuádriceps',350,210),('Recto femoral',350,140),('Vasto medial',520,300),('Vasto lateral',180,300),('Vasto intermedio',350,315),('Sartorio',550,205),('Aductor largo',520,495),('Aductor mayor',450,580),('Bíceps femoral',185,590),('Semitendinoso',480,685),('Semimembranoso',390,635),('Arteria femoral',545,405),('Vena femoral',570,460),('Nervio ciático',260,605)]),
('Pierna media','Miembro inferior',[('Tibia',310,300),('Peroné',160,430),('Tibial anterior',245,200),('Extensor largo de los dedos',155,275),('Extensor largo del hallux',220,345),('Peroneo largo',100,450),('Peroneo corto',130,520),('Sóleo',340,560),('Gastrocnemio medial',470,650),('Gastrocnemio lateral',200,650),('Tibial posterior',330,425),('Flexor largo de los dedos',440,440),('Flexor largo del hallux',225,490),('Membrana interósea',230,390),('Vasos tibiales anteriores',245,330)]),
('Brazo medio','Miembro superior',[('Húmero',350,400),('Bíceps braquial',350,225),('Braquial',350,315),('Tríceps cabeza larga',445,565),('Tríceps cabeza lateral',210,525),('Tríceps cabeza medial',340,510),('Arteria braquial',520,350),('Venas braquiales',550,400),('Nervio mediano',555,300),('Nervio radial',250,445),('Nervio cubital',500,515),('Tabique intermuscular medial',480,445),('Tabique intermuscular lateral',210,380),('Piel anterior del brazo',350,120),('Tejido subcutáneo posterior',350,700)]),
('Antebrazo medio','Miembro superior',[('Radio',220,390),('Cúbito',465,460),('Membrana interósea antebraquial',350,425),('Flexor superficial de los dedos',350,265),('Flexor profundo de los dedos',390,345),('Flexor largo del pulgar',240,300),('Braquiorradial',135,285),('Extensor común de los dedos',310,585),('Extensor cubital del carpo',520,590),('Flexor cubital del carpo',555,355),('Pronador redondo',230,195),('Arteria radial',120,365),('Arteria cubital',545,440),('Nervio mediano antebraquial',350,200),('Nervio cubital antebraquial',580,490)])]:ct(title,region,'Axial',rows)
assert len(CT)==20,len(CT)
for title,region,view,rows in CT:
 ns=[node(name,x,y,'organ',28,24) for name,x,y in rows]
 add('TC',region,title,view,ns,'axial' if view=='Axial' else 'body','ct')
assert sum(q['technique']=='TC' for q in questions)==300
# RM — 25 distinct anatomical views, ten objectives per view. Soft tissue is emphasized.
MR=[
('Encéfalo','Cráneo y cara','Sagital',[
('Cuerpo calloso',350,300),('Rodilla del cuerpo calloso',455,320),('Esplenio del cuerpo calloso',250,330),('Tálamo sagital',350,405),('Hipófisis',465,460),('Quiasma óptico',440,420),('Puente sagital',330,535),('Bulbo raquídeo',335,625),('Cerebelo sagital',205,540),('Cuarto ventrículo sagital',285,530)]),
('Encéfalo','Cráneo y cara','Coronal',[
('Sustancia blanca frontal derecha',240,250),('Sustancia blanca frontal izquierda',460,250),('Corteza cerebral derecha',140,305),('Corteza cerebral izquierda',560,305),('Ventrículo lateral derecho coronal',290,350),('Ventrículo lateral izquierdo coronal',410,350),('Tercer ventrículo coronal',350,425),('Tálamo derecho coronal',295,465),('Tálamo izquierdo coronal',405,465),('Cuerpo calloso coronal',350,290)]),
('Encéfalo','Cráneo y cara','Axial',[
('Sustancia blanca parietal derecha',240,320),('Sustancia blanca parietal izquierda',460,320),('Corteza frontal derecha axial',240,170),('Corteza frontal izquierda axial',460,170),('Asta frontal ventricular derecha',305,290),('Asta frontal ventricular izquierda',395,290),('Cápsula interna derecha',275,430),('Cápsula interna izquierda',425,430),('Tálamo derecho axial RM',310,470),('Tálamo izquierdo axial RM',390,470)]),
('Columna lumbar','Columna','Sagital',[
('Disco L1-L2',285,230),('Disco L2-L3',285,330),('Disco L3-L4',285,430),('Disco L4-L5',285,530),('Disco L5-S1',310,635),('Cono medular',400,230),('Saco dural lumbar',405,420),('Cola de caballo',405,550),('Ligamento longitudinal anterior',210,430),('Ligamento longitudinal posterior',355,430)]),
('Columna lumbar','Columna','Axial',[
('Disco intervertebral lumbar axial',350,300),('Núcleo pulposo',350,300),('Anillo fibroso anterior',350,235),('Anillo fibroso posterior',350,365),('Saco dural axial',350,465),('Articulación facetaria derecha RM',255,520),('Articulación facetaria izquierda RM',445,520),('Ligamento amarillo derecho',290,555),('Ligamento amarillo izquierdo',410,555),('Músculo multífido derecho RM',225,645)]),
('Columna lumbar','Columna','Coronal',[
('Cuerpo L1 coronal',350,155),('Cuerpo L2 coronal',350,265),('Cuerpo L3 coronal',350,375),('Cuerpo L4 coronal',350,485),('Cuerpo L5 coronal',350,595),('Psoas derecho RM coronal',225,430),('Psoas izquierdo RM coronal',475,430),('Ala sacra derecha RM',260,700),('Ala sacra izquierda RM',440,700),('Disco L4-L5 coronal',350,540)]),
('Columna cervical','Columna','Sagital',[
('Médula cervical',420,405),('Líquido cefalorraquídeo cervical',455,405),('Cuerpo de C2 RM',280,180),('Disco C2-C3',280,245),('Disco C3-C4',280,325),('Disco C4-C5',280,405),('Disco C5-C6',280,485),('Disco C6-C7',280,565),('Odontoides RM',310,105),('Ligamento nucal',530,410)]),
('Columna cervical','Columna','Axial',[
('Médula cervical axial',350,455),('LCR perimedular anterior',350,405),('LCR perimedular posterior',350,515),('Disco cervical axial',350,290),('Foramen neural derecho',250,380),('Foramen neural izquierdo',450,380),('Arteria vertebral derecha',195,340),('Arteria vertebral izquierda',505,340),('Multífido cervical derecho',240,610),('Multífido cervical izquierdo',460,610)]),
('Rodilla','Miembro inferior','Sagital',[
('Ligamento cruzado anterior',350,415),('Ligamento cruzado posterior',405,415),('Cuerno anterior del menisco medial',280,470),('Cuerno posterior del menisco medial',455,475),('Tendón rotuliano',215,480),('Tendón cuadricipital',215,230),('Rótula sagital RM',205,340),('Cartílago troclear',265,345),('Cartílago tibial',370,500),('Grasa infrapatelar',270,440)]),
('Rodilla','Miembro inferior','Coronal',[
('Menisco medial',465,420),('Menisco lateral',235,420),('Ligamento colateral medial',535,425),('Ligamento colateral lateral',160,425),('Cóndilo femoral medial RM',455,310),('Cóndilo femoral lateral RM',245,310),('Meseta tibial medial RM',455,505),('Meseta tibial lateral RM',245,505),('Eminencia tibial coronal',350,465),('Cabeza fibular RM coronal',150,555)]),
('Rodilla','Miembro inferior','Axial',[
('Faceta medial rotuliana',400,230),('Faceta lateral rotuliana',300,230),('Cresta rotuliana',350,270),('Tróclea femoral axial',350,360),('Cóndilo medial axial',470,430),('Cóndilo lateral axial',230,430),('Retináculo medial',480,280),('Retináculo lateral',220,280),('Arteria poplítea',350,565),('Vena poplítea',350,630)]),
('Hombro','Miembro superior','Coronal',[
('Tendón supraespinoso',375,275),('Músculo supraespinoso',235,235),('Tendón de la porción larga del bíceps',510,420),('Labrum superior',330,350),('Labrum inferior',330,510),('Cartílago humeral',405,380),('Acromion RM coronal',430,180),('Músculo deltoides',565,380),('Receso axilar',355,565),('Cabeza humeral RM coronal',450,435)]),
('Hombro','Miembro superior','Axial',[
('Tendón subescapular',320,265),('Músculo subescapular',190,265),('Tendón infraespinoso',330,530),('Músculo infraespinoso',185,570),('Labrum anterior',345,345),('Labrum posterior',345,465),('Glenoides axial',295,405),('Cabeza humeral axial',450,405),('Corredera bicipital',505,265),('Tendón bicipital axial',510,240)]),
('Hombro','Miembro superior','Sagital',[
('Músculo supraespinoso sagital',310,230),('Músculo infraespinoso sagital',235,465),('Músculo subescapular sagital',460,415),('Músculo redondo menor',225,595),('Escápula sagital RM',350,415),('Deltoides anterior',550,300),('Deltoides posterior',140,430),('Acromion sagital',350,155),('Coracoides sagital',470,240),('Arco coracoacromial',420,175)]),
('Cadera','Pelvis y cadera','Coronal',[
('Labrum acetabular superior',340,240),('Cartílago acetabular',320,305),('Cabeza femoral RM coronal',350,370),('Cuello femoral RM coronal',440,470),('Trocánter mayor RM',550,435),('Tendón del glúteo medio',545,350),('Glúteo medio',500,220),('Iliopsoas coronal',235,300),('Ligamento de la cabeza femoral',275,380),('Cápsula inferior de cadera',340,485)]),
('Cadera','Pelvis y cadera','Axial',[
('Labrum anterior de cadera',290,260),('Labrum posterior de cadera',290,505),('Cabeza femoral RM axial',365,390),('Acetábulo RM axial',245,385),('Tendón iliopsoas',345,185),('Glúteo menor',500,365),('Glúteo medio axial',550,470),('Glúteo mayor axial',440,640),('Obturador interno axial RM',195,490),('Nervio ciático de cadera',280,625)]),
('Cadera','Pelvis y cadera','Sagital',[
('Cabeza femoral RM sagital',350,380),('Labrum anterosuperior',250,270),('Labrum posterosuperior',450,270),('Cartílago femoral sagital',350,315),('Techo acetabular',350,210),('Tendón iliopsoas sagital',195,345),('Recto femoral proximal',140,445),('Glúteo mayor sagital',530,430),('Ligamento isquiofemoral',460,500),('Cápsula anterior de cadera',240,445)]),
('Tobillo','Miembro inferior','Sagital',[
('Tendón de Aquiles',175,465),('Fascia plantar',335,665),('Grasa de Kager',230,420),('Astrágalo RM sagital',355,420),('Calcáneo RM sagital',300,565),('Cartílago tibiotalar',350,345),('Tendón tibial anterior',475,290),('Articulación subtalar RM',325,485),('Navicular RM sagital',520,450),('Seno del tarso',420,510)]),
('Tobillo','Miembro inferior','Coronal',[
('Ligamento deltoideo',465,425),('Ligamento calcaneofibular',220,490),('Maléolo medial RM',425,350),('Maléolo lateral RM',245,395),('Cúpula astragalina RM',350,410),('Cartílago tibiotalar coronal',350,365),('Calcáneo RM coronal',350,600),('Sustentáculo del astrágalo RM',450,555),('Articulación subtalar coronal',350,515),('Sindesmosis tibiofibular RM',280,295)]),
('Tobillo','Miembro inferior','Axial',[
('Tendón tibial posterior',470,480),('Flexor largo de los dedos del tobillo',440,550),('Flexor largo del hallux del tobillo',365,590),('Tendón de Aquiles axial',350,700),('Tendones peroneos',170,495),('Tendón tibial anterior axial',460,220),('Extensor largo del hallux axial',390,190),('Tendones extensores de los dedos',280,205),('Tibia RM axial de tobillo',350,370),('Peroné RM axial de tobillo',180,370)]),
('Muñeca','Miembro superior','Coronal',[
('Fibrocartílago triangular',470,505),('Escafoides RM coronal',220,420),('Semilunar RM coronal',350,445),('Piramidal RM coronal',465,420),('Radio distal RM coronal',280,625),('Cúbito distal RM coronal',475,625),('Hueso grande RM coronal',350,300),('Ganchoso RM coronal',465,310),('Ligamento escafolunar',285,425),('Ligamento lunopiramidal',410,425)]),
('Muñeca','Miembro superior','Axial',[
('Nervio mediano del carpo',350,275),('Retináculo flexor',350,210),('Tendones flexores superficiales',350,350),('Tendones flexores profundos',350,425),('Tendón flexor largo del pulgar',235,355),('Escafoides RM axial',180,415),('Pisiforme RM axial',510,310),('Gancho del ganchoso',465,440),('Tendones extensores dorsales',350,625),('Canal de Guyon',550,275)]),
('Muñeca','Miembro superior','Sagital',[
('Radio distal RM sagital',350,625),('Semilunar RM sagital',350,470),('Hueso grande RM sagital',350,355),('Base metacarpiana RM sagital',350,220),('Tendones flexores sagitales',220,400),('Tendones extensores sagitales',480,405),('Articulación radiolunar',350,540),('Articulación lunocapitada',350,405),('Retináculo flexor sagital',190,380),('Cápsula dorsal del carpo',435,470)]),
('Codo','Miembro superior','Sagital',[
('Tendón tricipital',465,305),('Tendón braquial',235,375),('Cartílago troclear RM',365,340),('Olécranon RM sagital',470,410),('Coronoides RM sagital',290,440),('Grasa anterior del codo',275,260),('Grasa posterior del codo',455,235),('Receso anterior del codo',310,340),('Tróclea humeral RM sagital',360,365),('Cúbito RM sagital',445,600)]),
('Codo','Miembro superior','Coronal',[
('Ligamento colateral cubital',490,390),('Ligamento colateral radial',210,390),('Tendón flexor común',545,350),('Tendón extensor común',155,350),('Cabeza radial RM coronal',245,455),('Tróclea RM coronal',425,350),('Capítulo RM coronal',250,350),('Cartílago humerocubital',425,405),('Cuello radial RM coronal',245,540),('Nervio cubital del codo',540,430)])
]
assert len(MR)==25,len(MR)
for title,region,view,rows in MR:
 assert len(rows)==10,title
 # Identical coordinate for a whole disc and its nucleus is intentional in the map,
 # but localization would be ambiguous: spread the nucleus inside the disc and quiz the boundary separately.
 if title=='Columna lumbar' and view=='Axial':rows[0]=('Disco intervertebral lumbar · borde lateral',285,300)
 ns=[node(name,x,y,'soft',25,22) for name,x,y in rows]
 add('RM',region,title,view,ns,'axial' if view=='Axial' else 'joint','mr')
# Mammography: breast-specific positioning diagrams, not a chest image.
for side,mirror in [('Derecha',False),('Izquierda',True)]:
 for view in ['CC','MLO']:
  if view=='CC':rows=[('Pezón',350,645),('Región retroareolar',350,550),('Contorno cutáneo lateral',125,440),('Contorno cutáneo medial',575,440),('Tejido fibroglandular central',350,410),('Tejido adiposo anterior lateral',230,520),('Región posterior',350,245),('Borde de la pared torácica',350,165),('Mitad lateral de la mama',190,350),('Mitad medial de la mama',510,350)]
  else:rows=[('Pezón en MLO',535,480),('Región retroareolar en MLO',445,450),('Músculo pectoral en MLO',200,245),('Cola axilar',325,245),('Pliegue inframamario',365,650),('Tejido fibroglandular en MLO',360,410),('Tejido adiposo inferior',380,555),('Piel anterior en MLO',565,405),('Región superior en MLO',390,305),('Región posterior inferior',210,500)]
  ns=[node(label+' · mama '+side.lower(),700-x if mirror else x,y,'soft',27,24) for label,x,y in rows]
  add('Mamografía','Mama','Mama '+side,view,ns,'breast-cc' if view=='CC' else 'breast-mlo','mammo')
# DXA maps: acquisition/analysis anatomy, not diagnosis from fabricated scores.
rows=[('Cuerpo vertebral L1 · DXA',350,180),('Cuerpo vertebral L2 · DXA',350,300),('Cuerpo vertebral L3 · DXA',350,420),('Cuerpo vertebral L4 · DXA',350,540),('Espacio L1-L2 · DXA',350,240),('Espacio L2-L3 · DXA',350,360),('Espacio L3-L4 · DXA',350,480),('Referencia L5 · DXA',350,665),('Referencia sacra · DXA',350,750),('Región lumbar L1-L4 · límite lateral',455,390)]
add('DXA','Columna','Región lumbar de análisis','PA',points(rows),'spinefront','dxa')
rows=[('Cabeza femoral · DXA',280,230),('Cuello femoral · DXA',385,335),('Trocánter mayor · DXA',520,325),('Trocánter menor · DXA',415,470),('Región intertrocantérica · DXA',480,410),('Diáfisis femoral proximal · DXA',500,610),('Eje largo del cuello femoral',335,285),('Borde superior del cuello',400,285),('Borde inferior del cuello',360,380),('Referencia acetabular · DXA',200,200)]
add('DXA','Pelvis y cadera','Fémur proximal de análisis','AP',points(rows),'hip','dxa')
# Forty authored technique objectives. Distinct facts; no diagnostic or patient scenarios.
TECH_MAMMO=[
('Energía utilizada','¿Qué tipo de radiación utiliza la mamografía?','Rayos X','Ultrasonidos|Radiofrecuencia sin campo magnético|Luz visible','La mamografía utiliza rayos X de baja dosis para obtener imágenes de la mama.'),
('Significado CC','¿Qué significa CC en una proyección mamográfica?','Craneocaudal','Caudocervical|Coronoclavicular|Costocondral','CC identifica la proyección craneocaudal.'),
('Significado MLO','¿Qué significa MLO?','Mediolateral oblicua','Medial longitudinal ortogonal|Mamaria lateral opuesta|Medial lumbar oblicua','MLO identifica la proyección mediolateral oblicua.'),
('Compresión y espesor','¿Qué efecto geométrico busca la compresión mamaria?','Reducir el espesor del tejido','Aumentar el espesor|Introducir aire en la mama|Desplazar la mama fuera del detector','La compresión distribuye el tejido y reduce su espesor.'),
('Compresión y movimiento','¿Cómo ayuda la compresión respecto al movimiento?','Estabiliza la mama','Aumenta el movimiento|Elimina la necesidad de posicionar|Solo cambia el color de la imagen','La estabilización reduce la borrosidad por movimiento.'),
('Tejidos superpuestos','¿Qué problema intenta reducir una buena distribución del tejido?','Superposición de estructuras','Pérdida del campo magnético|Ruido acústico|Interferencia del ECG','La distribución del tejido facilita su representación y reduce superposiciones.'),
('Detector digital','¿Qué transforma el receptor digital mamográfico en información de imagen?','La señal producida por los rayos X recibidos','El sonido reflejado|La temperatura del pezón|El pulso arterial','Un sistema digital convierte la señal del receptor en datos de imagen.'),
('Tomosíntesis','¿Qué caracteriza a la tomosíntesis mamaria?','Adquisición de proyecciones desde varios ángulos','Una sola fotografía externa|Una secuencia de ultrasonidos|Ausencia de rayos X','La tomosíntesis usa proyecciones anguladas para reconstruir planos.'),
('Marcador de lado','¿Qué dato debe quedar inequívoco en la identificación de la imagen?','La lateralidad','El color de la ropa|La altura del operador|El modelo de teléfono','La lateralidad evita confundir la mama derecha con la izquierda.'),
('Pectoral en MLO','¿Qué estructura muscular es una referencia de posicionamiento en MLO?','Músculo pectoral','Músculo psoas|Músculo sóleo|Músculo temporal','La representación pectoral forma parte de la valoración del posicionamiento MLO.'),
('Pliegue inframamario','¿Qué referencia corresponde al límite inferior de la mama sobre el tórax?','Pliegue inframamario','Surco interglúteo|Hueco poplíteo|Fosa cubital','El pliegue inframamario es una referencia inferior de posicionamiento.'),
('Pezón de perfil','¿Qué ayuda a separar el pezón del tejido retroareolar proyectado?','Representarlo de perfil cuando sea posible','Ocultarlo deliberadamente|Recortarlo siempre|Sustituirlo por un marcador sin registrar el motivo','El perfil facilita identificar el pezón y la región retroareolar.'),
('Pliegues cutáneos','¿Qué defecto de posicionamiento puede superponer sombras sobre tejido mamario?','Pliegues de piel','Ausencia de ondas de radio|Falta de gel acústico|No utilizar bobina de RM','Los pliegues cutáneos son un aspecto de la calidad del posicionamiento.'),
('Región retroareolar','¿Dónde se sitúa la región retroareolar?','Por detrás de la areola','En la pelvis|Dentro de la clavícula|Por detrás del calcáneo','Retroareolar describe el tejido situado detrás de la areola.'),
('Mama y tórax','¿Sobre qué región de la pared corporal se sitúa la mama?','Pared torácica anterior','Pared abdominal posterior|Región lumbar|Hueco poplíteo','La mama se relaciona con la pared torácica anterior.'),
('Grasa mamaria','En una imagen mamográfica, ¿qué tejido suele ser menos atenuante que el fibroglandular?','Tejido adiposo','Cortical ósea|Metal|Calcio','La grasa suele atenuar menos los rayos X que el tejido fibroglandular.'),
('Inclinación MLO','¿Cómo se adapta la inclinación del posicionamiento MLO?','A la anatomía de la paciente y al protocolo','Siempre a cero grados|Siempre a noventa grados|Sin tener en cuenta la pared torácica','La inclinación se adapta al posicionamiento y a la anatomía; no existe un único ángulo válido para todas las pacientes.'),
('Movimiento durante exposición','¿Qué acción técnica favorece evitar borrosidad durante la exposición?','Mantener la inmovilidad indicada','Mover el hombro durante la exposición|Cambiar la compresión continuamente|Retirar el detector','La inmovilidad forma parte de la adquisición de una imagen nítida.'),
('Dos vistas','¿Qué aporta estudiar una estructura en dos proyecciones diferentes?','Información espacial complementaria','Duplicar automáticamente el diagnóstico|Eliminar la necesidad de identificación|Convertir la mamografía en RM','Las proyecciones complementarias ayudan a comprender la posición espacial.'),
('Cribado y diagnóstico','¿Qué diferencia de objetivo distingue una mamografía de cribado?','Se realiza para detección en personas sin síntomas','Siempre incluye una biopsia|Solo examina tejido óseo|Excluye cualquier comparación previa','El cribado busca detección en personas sin síntomas; la evaluación diagnóstica responde a hallazgos o síntomas y se individualiza.')]
TECH_DXA=[
('Principio físico','¿Qué significa la doble energía en DXA?','Uso de dos energías de rayos X','Dos campos magnéticos|Dos sondas ultrasónicas|Dos fotografías de superficie','DXA es absorciometría de rayos X de energía dual.'),
('Magnitud areal','¿Qué tipo de densidad expresa la DMO habitual de DXA?','Densidad mineral ósea areal','Densidad volumétrica directa|Densidad de protones|Velocidad de flujo','DXA informa habitualmente una densidad areal, no una medida volumétrica directa.'),
('Unidad DMO','¿Cuál es la unidad habitual de DMO areal en DXA?','g/cm²','HU|m/s|tesla','La DMO areal se expresa habitualmente en gramos por centímetro cuadrado.'),
('Lumbar estándar','¿Qué niveles lumbares forman habitualmente la región de análisis PA lumbar?','L1-L4','C1-C4|T1-T4|S1-S4','La región lumbar PA de referencia incluye habitualmente L1 a L4; las exclusiones requieren criterios profesionales.'),
('Cadera y cuello','¿Qué región del fémur se analiza habitualmente junto con la cadera total?','Cuello femoral','Diáfisis humeral|Cuerpo del astrágalo|Cabeza radial','El cuello femoral es una región de análisis de la DXA central de cadera.'),
('Referencia anatómica','¿A qué región pertenece el trocánter mayor?','Fémur proximal','Radio distal|Columna cervical|Cráneo','El trocánter mayor es una prominencia del fémur proximal.'),
('ROI','¿Qué significa ROI en el análisis de imagen?','Región de interés','Radiación óptica integrada|Rotación ósea inversa|Resonancia orbital interna','ROI delimita la región de interés que se va a analizar.'),
('Repetibilidad','¿Qué favorece la comparación técnica entre exploraciones sucesivas?','Posicionamiento reproducible','Cambiar siempre la región analizada|Rotación aleatoria|Eliminar los identificadores','Un posicionamiento y análisis reproducibles favorecen la comparación.'),
('Artefacto metálico','¿Qué elemento externo puede interferir con el análisis de una zona?','Metal proyectado sobre la región','El color de ojos|El peinado fuera del campo|El idioma del paciente','Los materiales superpuestos pueden producir artefactos y necesitan revisión técnica.'),
('T-score referencia','¿Con qué referencia se relaciona el T-score?','Adulto joven de referencia','Solo el resultado previo del paciente|Un mapa de HU|La intensidad de señal T2','El T-score expresa diferencia respecto a una población adulta joven de referencia.'),
('Z-score referencia','¿Con qué referencia se relaciona el Z-score?','Población de referencia de edad comparable','Solo recién nacidos|El aire ambiental|La velocidad de la mesa','El Z-score se compara con una población de referencia de edad comparable.'),
('Mismo equipo','¿Qué facilita técnicamente el seguimiento seriado?','Usar un equipo comparable y controlado','Alternar equipos sin calibración|Cambiar unidades en cada visita|Evitar cualquier control de calidad','La comparabilidad del equipo y su control de calidad son relevantes en el seguimiento.'),
('Fantoma','¿Qué herramienta se utiliza en controles de calidad del equipo?','Fantoma de referencia','Un teléfono sin calibrar|Una imagen clínica inventada|Una tarjeta de color','Los fantomas ayudan a verificar la estabilidad del sistema según el programa de calidad.'),
('Radiación DXA','¿DXA utiliza radiación ionizante?','Sí, rayos X','No, solo sonido|No, solo luz|No, solo magnetismo','DXA utiliza rayos X a dosis bajas.'),
('DXA frente TC','¿Qué diferencia conceptual existe entre DXA habitual y TC cuantitativa?','Medición areal frente a medición volumétrica','Son el mismo procedimiento|DXA utiliza ultrasonidos|La TC no utiliza rayos X','La DXA habitual informa DMO areal; la TC cuantitativa puede aportar densidad volumétrica.'),
('Región lumbar y superposición','¿Por qué se revisan elementos superpuestos a la columna en DXA?','Pueden alterar la medición aparente','Porque siempre mejoran el resultado|Porque convierten la imagen en 3D|Porque eliminan el ruido magnético','La revisión técnica identifica elementos que pueden sesgar la medición.'),
('Cabeza y cuello','¿Qué une la cabeza femoral con la región trocantérica?','Cuello femoral','Olécranon|Acromion|Apófisis odontoides','El cuello conecta la cabeza femoral con el resto del fémur proximal.'),
('Antebrazo','¿Qué huesos forman la región del antebrazo que puede estudiarse en DXA?','Radio y cúbito','Tibia y peroné|Húmero y escápula|Fémur y rótula','Radio y cúbito forman el antebrazo.'),
('Informe técnico','¿Qué dato identifica qué zona se ha medido?','Región anatómica y lateralidad cuando proceda','Color de la pantalla|Marca del teclado|Tipo de calzado','La identificación de la región y el lado cuando procede forma parte de un registro inequívoco.'),
('Contenido mineral óseo','¿Qué unidad corresponde al contenido mineral óseo, a diferencia de la DMO areal?','Gramos','Teslas|Metros por segundo|Unidades Hounsfield','El contenido mineral óseo expresa cantidad mineral en gramos; la DMO areal relaciona esa cantidad con un área.')]
for mod,rows,source,region in [('Mamografía',TECH_MAMMO,'mammo','Mama'),('DXA',TECH_DXA,'dxa','Técnica')]:
 for key,prompt,answer,distractors,explanation in rows:
  questions.append(dict(id=slug(mod+' tecnica '+key),technique=mod,region=region,view='Técnica',type='Técnica',difficulty='Intermedio',label=key,prompt=prompt,options=[answer]+distractors.split('|'),answer=0,explanation=explanation,source=source,objective=mod+'|técnica|'+key))
exec(Path('lab-technique-content.py').read_text())
# Export without procedural question multiplication at runtime.
assert len(questions)==982,(len(questions),{m:sum(q['technique']==m for q in questions) for m in ['RX','TC','RM','Mamografía','DXA']})
assert len({q['id'] for q in questions})==len(questions)
assert len({q['objective'] for q in questions})==len(questions)
used={q.get('atlas') for q in questions};atlases=[a for a in atlases if a['id'] in used]
for a in atlases:
 ids={q['target'] for q in questions if q.get('atlas')==a['id']}
 # Keep anatomical context nodes, but only exercise targets appear in answer choices.
 a['targetIds']=sorted(ids)
# Shape atlas uses intentionally schematic colors. Never imitate patient scans.
def svg(a):
 def ellipse(cx,cy,rx,ry,fill,stroke='#7bbac4',sw=2):return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
 o=a['outline'];mod=a['technique'];base=[]
 if o in ['axial']:
  base+=[ellipse(350,420,277,315,'#142a37','#467180',4),ellipse(350,420,250,285,'#0b1c2a','#294d5e',2)]
 elif o.startswith('breast'):
  if o=='breast-cc':base+=['<path d="M120 170H580V420Q565 635 350 675Q135 635 120 420Z" fill="#203e4c" stroke="#8cc5ca" stroke-width="4"/>']
  else:base+=['<path d="M150 145L400 180Q555 260 585 470Q520 665 330 690L160 550Z" fill="#203e4c" stroke="#8cc5ca" stroke-width="4"/><path d="M150 145L335 200L165 415Z" fill="#467887" opacity=".65"/>']
 elif o in ['skull','skulllat']:
  base+=[ellipse(350,350,240,250,'#132a37','#93b7bd',6),'<path d="M170 440L185 610Q350 750 515 610L530 440" fill="none" stroke="#a4c2c9" stroke-width="15"/>']
 elif o in ['spinefront','spinelateral']:
  base+=['<path d="M350 100V760" fill="none" stroke="#285163" stroke-width="90" stroke-linecap="round"/>']
 elif o in ['hand','foot']:
  for n in a['nodes']:
   if 'metacarpiano' in n['label'].lower() or 'metatarsiano' in n['label'].lower():base.append(f'<path d="M{n["x"]} {n["y"]-40}L{n["x"]} {n["y"]+55}" stroke="#789ba8" stroke-width="35" stroke-linecap="round"/>')
 elif o=='pelvis':base+=['<path d="M350 210C180 80 65 170 110 365L210 515L260 650L350 575L440 650L490 515L590 365C635 170 520 80 350 210Z" fill="#173442" stroke="#7aa3b0" stroke-width="10"/>']
 else:base+=[ellipse(350,420,230,310,'#102735','#345867',3)]
 # Region-specific anatomical silhouettes provide context beneath the target features.
 title=a['title'].lower();view=a['view']
 def path(d,fill='#294653',stroke='#799fac',sw=3):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
 if 'encéfalo' in title and view=='Axial':
  base+=[path('M340 135C150 95 100 270 140 460C130 580 205 695 330 680L340 135Z','#223f4d'),path('M360 135C550 95 600 270 560 460C570 580 495 695 370 680L360 135Z','#223f4d')]
  base+=[path('M325 270Q285 300 310 355L330 395L340 345Z','#091b28'),path('M375 270Q415 300 390 355L370 395L360 345Z','#091b28')]
  for y in [205,245,520,565,610]:base+=[path(f'M150 {y}Q230 {y-50} 290 {y-15}','none','#385d6b',3),path(f'M550 {y}Q470 {y-50} 410 {y-15}','none','#385d6b',3)]
 elif 'encéfalo' in title and view=='Sagital':
  base+=[path('M135 420C75 210 265 85 445 155Q595 195 555 410L440 490L345 485L285 540L160 530Z','#264755'),ellipse(205,540,88,75,'#385d67'),path('M330 480Q350 545 335 650','none','#84a5b2',35),path('M245 335Q350 230 470 325','none','#9bb3bb',28)]
 elif 'encéfalo' in title:
  base+=[path('M345 135C180 110 90 270 150 490Q170 625 330 595L345 135Z','#264755'),path('M355 135C520 110 610 270 550 490Q530 625 370 595L355 135Z','#264755')]
 elif o in ['hand','foot']:
  # Connect sequential phalanges with slim shafts, retaining distinct joint gaps.
  bydigit={}
  for n in a['nodes']:
   lab=n['label'].lower()
   if 'falange' in lab or 'metacarpiano' in lab or 'metatarsiano' in lab:
    import re as _re
    digit=(_re.findall(r'dedo (\d)',lab) or _re.findall(r'(?:metacarpiano|metatarsiano) (\d)',lab) or ['1'])[0]
    bydigit.setdefault(digit,[]).append(n)
  for seq in bydigit.values():
   seq.sort(key=lambda n:n['y'])
   for lo,hi in zip(seq,seq[1:]):
    if abs(lo['y']-hi['y'])<170:base.append(path(f'M{lo["x"]} {lo["y"]+15}L{hi["x"]} {hi["y"]-15}','none','#658d9c',16))
 elif 'rodilla' in title or o in ['knee','kneelat']:
  if view in ['Sagital','Lateral']:
   base+=[path('M330 100L450 100L470 330Q495 445 400 460Q310 445 310 370Z','#718f9c'),path('M300 500L470 500L435 740L330 740Z','#6c8d9b'),ellipse(205,335,38,55,'#88a4af')]
  elif view=='Axial':base+=[ellipse(235,420,85,95,'#7595a2'),ellipse(465,420,85,95,'#7595a2'),path('M290 190Q350 145 410 190L350 280Z','#8aabb7')]
  else:base+=[path('M275 100H425L470 270Q535 360 450 380Q380 395 350 360Q320 395 250 380Q165 360 230 270Z','#7297a3'),path('M230 460H470L420 740H280Z','#6a909d'),path('M160 515L175 735','none','#809ca8',25)]
 elif 'hombro' in title or o=='shoulder':
  base+=[ellipse(450,415,78,85,'#7596a2'),path('M410 475L485 475L495 730L425 730Z','#6d8f9c'),path('M310 300L345 490L205 615L160 330Z','#2e5363'),path('M190 190Q310 170 440 205','none','#91adb9',23)]
 elif 'cadera' in title or 'fémur' in title or o=='hip':
  base+=[ellipse(305 if o=='hip' else 350,300 if o=='hip' else 375,65,65,'#819faa'),path('M340 335L490 405L540 730L465 730L445 450L310 390Z','#6c919e'),path('M220 160Q105 220 205 395L250 320Q160 250 280 205Z','#355967')]
 elif 'tobillo' in title or o in ['ankle','anklelat']:
  if view in ['Sagital','Lateral']:
   base+=[path('M300 100H390L410 335H285Z','#7b9eaa'),ellipse(350,430,65,45,'#89a7b1'),path('M150 545Q230 485 350 535L420 620Q280 695 125 620Z','#6f949f'),ellipse(510,470,45,35,'#829da8')]
  else:base+=[path('M300 100H405L435 410L385 450H295Z','#7a9ca8'),path('M205 130L235 130L250 480L215 500Z','#86a7b1'),ellipse(350,485,72,48,'#799aa6')]
 elif 'muñeca' in title:
  base+=[path('M245 740L220 565L325 540L330 740Z','#718f9d'),path('M440 740L445 565L500 565L510 740Z','#7899a6')]
 elif 'codo' in title or o in ['elbow','elbowlat']:
  base+=[path('M290 100H400L440 340Q400 390 350 370Q290 390 240 340Z','#7397a5'),path('M240 440L280 440L280 740H220Z','#7c9ca8'),path('M360 440Q410 390 440 430L425 740H365Z','#698f9e')]
 # Different visual vocabulary for skeletal and sectional schematics. Cross sections use tissue colors, not invented HU/T1/T2 signal.
 for n in a['nodes']:
  x,y,rx,ry=n['x'],n['y'],n['rx'],n['ry'];kind=n['kind'];name=n['label'].lower()
  if mod=='TC' and any(w in name for w in ['hueso','cuerpo vertebral','cráneo','sacro','tibia','peroné','fémur','húmero','radio','cúbito','pedículo','lámina','apófisis']):kind='bone'
  if mod=='TC' and any(w in name for w in ['lóbulo frontal','lóbulo occipital','pulmón','hígado','bazo','glúteo','psoas']):rx=max(rx,55);ry=max(ry,55)
  if kind=='bone' and ('falange' in name or 'metacarpiano' in name or 'metatarsiano' in name):base.append(path(f'M{x-rx*.6} {y-ry}Q{x} {y-ry-8} {x+rx*.6} {y-ry}L{x+rx*.4} {y+ry*.65}Q{x+rx} {y+ry} {x} {y+ry}Q{x-rx} {y+ry} {x-rx*.4} {y+ry*.65}Z','#819faa','#b3cbd3',3))
  elif kind=='bone':base.append(f'<rect x="{x-rx}" y="{y-ry}" width="{rx*2}" height="{ry*2}" rx="{min(rx,ry)*.7}" fill="#8daeb9" fill-opacity=".6" stroke="#b3ccd2" stroke-width="3"/>')
  elif kind=='space':base.append(ellipse(x,y,rx,ry,'#05111c','#587f90',2))
  elif any(w in n['label'].lower() for w in ['ligamento','tendón','retináculo','fascia']):
   base.append(f'<path d="M{x-15} {y-32}Q{x+8} {y} {x+15} {y+32}" fill="none" stroke="#b9b8d9" stroke-width="12" stroke-linecap="round"/>')
  elif 'menisco' in n['label'].lower():base.append(f'<path d="M{x-28} {y+18}L{x+26} {y+18}L{x} {y-18}Z" fill="#78989f" stroke="#b4d2d9" stroke-width="3"/>')
  elif any(w in n['label'].lower() for w in ['arteria','aorta','vena','yugular','carótida']):base.append(ellipse(x,y,rx*.65,ry*.65,'#416b87','#9dc5d7',3))
  elif 'riñón' in n['label'].lower():base.append(f'<path d="M{x} {y-35}C{x-60} {y-45} {x-60} {y+45} {x} {y+35}Q{x+25} {y+20} {x} {y}Q{x+25} {y-20} {x} {y-35}Z" fill="#477e8b" stroke="#9dc8d5" stroke-width="3"/>')
  else:
   color='#477e8b' if mod=='TC' else '#46647f' if mod=='RM' else '#557f83'
   base.append(ellipse(x,y,rx,ry,color,'#90bec9',2))
 # Orientation conventions are explicit. Axial: anterior up; patient's right on image left.
 orient='A · ANTERIOR' if a['view']=='Axial' else 'DISTAL' if o in ['hand','foot'] else 'PARED TORÁCICA' if o=='breast-cc' else 'SUPERIOR'
 profile=view in ['Sagital','Lateral']
 leftmark=('P' if ('encéfalo' in title or 'cráneo' in title) else 'A') if profile else 'RADIAL' if o=='hand' else 'MEDIAL' if o=='foot' else 'D'
 rightmark=('A' if ('encéfalo' in title or 'cráneo' in title) else 'P') if profile else 'CUBITAL' if o=='hand' else 'LATERAL' if o=='foot' else 'I'
 text=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 850" width="700" height="850"><title>{a['title']} · {a['view']}</title><rect width="700" height="850" rx="18" fill="#071522"/><rect x="16" y="16" width="668" height="818" rx="16" fill="none" stroke="#345e70"/><g>{''.join(base)}</g><g fill="#bdd4df" font-family="Arial,sans-serif" font-size="16"><text x="350" y="52" text-anchor="middle">{orient}</text><text x="40" y="90">{leftmark}</text><text x="645" y="90">{rightmark}</text><text x="350" y="790" text-anchor="middle">MAPA ANATÓMICO SIMPLIFICADO · NO CLÍNICO</text><text x="350" y="816" text-anchor="middle" font-size="12">Colores didácticos; no representan densidad ni señal.</text></g></svg>'''
 return text
for a in atlases:a['svg']=svg(a)
payload={'version':'5.1','sources':SOURCES,'atlases':atlases,'exercises':questions,'curriculum':{'RX':350,'TC':300,'RM':250,'Mamografía':60,'DXA':40}}
Path('lab-atlas.js').write_text('/* Atlas didáctico original. Sin imágenes clínicas ni casos diagnósticos. Generado por build-lab-atlas.py. */\n(()=>{const atlas='+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';const legacy=window.RADIOSAS_LAB;const intro=legacy.spots.map(s=>({...s,technique:"RX",region:"Tórax",view:"PA",type:"Localización",difficulty:"Básico",atlas:"rx-torax-original",target:s.id,objective:"RX|tórax inicial|PA|"+s.id,source:"axial"}));window.RADIOSAS_LAB=Object.freeze({...legacy,...atlas,spots:legacy.spots,exercises:Object.freeze([...intro,...atlas.exercises])});})();\n')
Path('LAB_ATLAS_INVENTARIO.json').write_text(json.dumps({'total':1000,'atlasCount':len(atlases)+1,'byTechnique':payload['curriculum'],'sources':SOURCES,'objectives':[{'id':sid,'objective':'RX|tórax inicial|PA|'+sid} for sid in re.findall(r"id:'([^']+)'",Path('lab-data.js').read_text())]+[{'id':q['id'],'objective':q['objective']} for q in questions]},ensure_ascii=False,indent=2)+'\n')
print('TOTAL',len(questions)+18,'ATLASES',len(atlases)+1, 'modalities',payload['curriculum'])
