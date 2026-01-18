/* ===== Configuración ===== */
const CONFIG = {
  sheetEndpoint: 'https://script.google.com/macros/s/AKfycbwoOLEJPL12EvzSAt63WolJ7hDWzuzZKQB8u7kMx7Mp9TLar8NMgFKPdTzSUfJW26B6Ig/exec', 
  proyecto: 'Encuestas Beck',
  version: '1.0.0'
};

const SECRET = 'clave123';
const payload = { test:'BDI', puntaje:12, token:SECRET };

/* ===== Utilidades ===== */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const saveLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const readLocal = key => JSON.parse(localStorage.getItem(key) || 'null');
const todayISO = () => new Date().toISOString();

/* ===== Ítems (texto simplificado y neutral) ===== */
/* ===== BDI con opciones completas (0–3) ===== */
const BDI_FULL = [
  { q: '1 TRISTEZA', opts: [
    '0 No me siento triste',
    '1 Me siento triste gran parte del tiempo',
    '2 Me siento triste todo el tiempo',
    '3 Me siento tan triste o soy tan infeliz que no puedo soportarlo'
  ]},
  { q: '2 PESIMISMO', opts: [
    '0 No me siento especialmente desanimado (a) respecto a futuro',
    '1 Me siento desanimado (a) respecto al futuro',
    '2 Siento que no tengo nada que esperar',
    '3 Siento que el futuro es desesperanzador y las cosas no mejoran'
  ]},
  { q: '3 FRACASO', opts: [
    '0 No me siento fracasado (a)',
    '1 Creo que he fracasado mas que la mayoría de las personas',
    '2 Cuando miro hacia atrás, solo veo fracaso tras fracaso',
    '3 Me siento ya persona totalmente fracasada'
  ]},
  { q: '4 PÉRDIDA DEL PLACER', opts: [
    '0 Las cosas me satisfacen tanto como antes',
    '1 No disfruto de las cosas tanto como antes',
    '2 Ya no obtengo una satisfacción autentica',
    '3 Estoy insatisfecho o aburrido de todo.'
  ]},
  { q: '5 SENTIMIENTOS DE CULPA', opts: [
    '0 No me siento especialmente culpable',
    '1 Me siento culpable en bastantes ocasiones',
    '2 Me siento culpable en la mayoría de las ocasiones',
    '3 Me siento culpable constantemente'
  ]},
  { q: '6 SENTIMIENTOS DE CASTIGO', opts: [
    '0 No creo que este siendo castigado (a)',
    '1 Me siento como si fuese a ser castigado (a)',
    '2 Espero ser castigado (a)',
    '3 Siento que estoy siendo castigado (a)'
  ]},
  { q: '7 DISCONFORMIDAD CON UNO MISMO', opts: [
    '0 No estoy decepcionado (a) de mi mismo (a)',
    '1 Estoy decepcionado (a) de mi mismo (a)',
    '2 Me da vergüenza de mi mismo (a)',
    '3 Me detesto'
  ]},
  { q: '8 AUTOCRÍTICA', opts: [
    '0 No me considero peor que cualquier otro (a)',
    '1 Me autocritico por mis debilidades o por mis errores',
    '2 Continuamente me culpo por mis faltas',
    '3 Me culpo por todo lo malo que me sucede'
  ]},
  { q: '9 PENSAMIENTOS O DESEOS SUICIDAS', opts: [
    '0 No tengo ningún pensamiento de suicidio',
    '1 A veces pienso en suicidarme pero no lo cometería',
    '2 Desearía suicidarme',
    '3 Me suicidaría si tuviera la oportunidad'
  ]},
  { q: '10 LLANTO', opts: [
    '0 No lloro más de lo que solía',
    '1 Ahora lloro más que antes',
    '2 Lloro continuamente',
    '3 Antes era capaz de llorar, pero ahora no puedo, incluso aunque quiera.'
  ]},
  { q: '11 AGITACIÓN', opts: [
    '0 No estoy mas inquieto o tenso que lo habitual',
    '1 Me siento mas inquieto o tenso que lo habitual',
    '2 Estoy tan inquieto o agitado que me es difícil quedarme quieto',
    '3 Estoy tan inquieto o agitado que tengo que estar siempre en movimiento o haciendo algo'
  ]},
  { q: '12 PÉRDIDA DE INTERÉS', opts: [
    '0 No he perdido el interés por los demás',
    '1 Estoy menos interesado en los demás que antes',
    '2 He perdido la mayor parte de mi interés por los demás',
    '3 He perdido todo el interés por los demás'
  ]},
  { q: '13 INDECISIÓN', opts: [
    '0 Tomo decisiones más o menos como siempre lo he hecho',
    '1 Evito tomar decisiones más que antes',
    '2 Tomar decisiones me resulta mucho más difícil que antes',
    '3 Ya me es imposible tomar decisiones'
  ]},
  { q: '14 DESVALORIZACIÓN', opts: [
    '0 Me considero valioso (a)',
    '1 No me considero a mi mismo (a) tan valioso (a) y útil como solía considerarme',
    '2 Me siento menos valioso (a) cuando me comparo con otros',
    '3 Siento que no valgo nada'
  ]},
  { q: '15 PÉRDIDA DE LA ENERGÍA', opts: [
    '0 Tengo tanta energía como siempre',
    '1 Tengo menos energía de la que solía tener',
    '2 No tengo suficiente energía para hacer demasiado',
    '3 No tengo energía suficiente para hacer nada'
  ]},
  { q: '16 CAMBIOS EN LOS HÁBITOS DE SUEÑO', opts: [
    '0 No he experimentado ningún cambio en mis hábitos de sueño',
    '1 Duermo un poco más de lo habitual o duermo un poco menos de lo habitual',
    '2 Duermo mucho más de lo habitual o duermo mucho menos de lo habitual',
    '3 Duermo la mayor parte del día o me despierto 1’2 horas más temprano y no puedo volver a dormirme'
  ]},
  { q: '17 IRRITABILIDAD', opts: [
    '0 No estoy mas irritable que lo habitual',
    '1 Estoy más irritable que lo habitual',
    '2 Estoy mucho mas irritable que lo habitual',
    '3 Estoy irritable todo el tiempo'
  ]},
  { q: '18 CAMBIOS EN EL APETITO', opts: [
    '0 No he experimentado ningún cambio en el apetito',
    '1 Mi apetito es un poco menor que lo habitual o mi apetito es un poco mayor que lo habitual',
    '2 Mi apetito es mucho menor que antes o mi apetito mucho mayor que lo habitual',
    '3 No tengo apetito en lo absoluto o quiero comer todo el día'
  ]},
  { q: '19 DIFICULTADES DE CONCENTRACIÓN', opts: [
    '0 Me puedo concentrar tan bien como siempre',
    '1 No puedo concentrarme tan bien como habitualmente',
    '2 Me es difícil mantener la mente en algo por mucho tiempo',
    '3 No puedo concentrarme en nada'
  ]},
  { q: '20 CANSANCIO O FATIGA', opts: [
    '0 No estoy más cansado (a) o fatigado (a) que lo habitual',
    '1 Me fatigo o me canso más fácilmente que lo habitual',
    '2 Estoy demasiado fatigado (a) o cansado (a) para hacer muchas cosas de las que antes solía hacer',
    '3 Estoy demasiado cansado (a) o fatigado (a) para hacer la mayoría de las cosas que solía hacer'
  ]},
  { q: '21 RENDIMIENTO ESCOLAR', opts: [
    '0 Estudio igual que antes',
    '1 Me cuesta un esfuerzo extra comenzar a hacer algo',
    '2 Tengo que obligarme mucho para hacer algo',
    '3 No puedo hacer nada en lo absoluto'
  ]}
];

/* ===== BAI con opciones completas (0–3) ===== */
const BAI_FULL = [
  { q: '1 Torpe o entumecido (a).', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '2 Acalorado (a).', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '3 Con temblor en las piernas.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '4 Incapaz de relajarse.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '5 Con temor a que ocurra lo peor.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '6 Mareado (a) o que se le va la cabeza.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '7 Con latidos del corazón fuertes y acelerados.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '8 Inestable.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '9 Atemorizado (a) o asustado (a).', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '10 Nervioso (a).', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '11 Con sensación de bloqueo.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '12 Con temblores en las manos.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '13 Inquieto (a), inseguro (a).', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '14 Con miedo a perder el control.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '15 Con sensación de ahogo.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '16 Con temor a morir.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '17 Con miedo.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '18 Con problemas digestivos.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '19 Con desvanecimientos.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '20 Te ruborizas constantemente.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] },
  { q: '21 Con sudores, fríos o calientes.', opts: ['0 No','1 Leve','2 Moderado','3 Bastante'] }
];

/* Opciones 0–3 */
const OPTIONS = [
  { v: 0, t: 'Nada' },
  { v: 1, t: 'Leve' },
  { v: 2, t: 'Moderado' },
  { v: 3, t: 'Severo' }
];

/* ===== Render dinámico ===== */
function renderList(containerId, items, storageKey){
  const list = document.querySelector(containerId);
  list.innerHTML = '';
  const saved = readLocal(storageKey) || {};

  items.forEach((entry, idx) => {
    const li = document.createElement('li');
    li.className = 'item';

    const name = `${storageKey}-${idx}`;
    const selected = saved[name] ?? null;

    const title = document.createElement('div');
    title.className = 'item-title';
    const isFull = typeof entry === 'object' && Array.isArray(entry.opts);
    title.textContent = isFull ? entry.q : `${idx + 1}. ${entry}`;

    const group = document.createElement('div');
    group.className = 'item-options';

    const opts = isFull ? entry.opts.map((t, i) => ({ v: i, t })) : [
      { v: 0, t: 'Nada' },
      { v: 1, t: 'Leve' },
      { v: 2, t: 'Moderado' },
      { v: 3, t: 'Severo' }
    ];

    opts.forEach(opt => {
      const id = `${name}-${opt.v}`;
      const labelEl = document.createElement('label');
      labelEl.className = 'opt';
      labelEl.setAttribute('for', id);

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = name;
      input.id = id;
      input.value = String(opt.v);
      if (String(selected) === String(opt.v)) input.checked = true;

      input.addEventListener('change', () => {
        const current = readLocal(storageKey) || {};
        current[name] = Number(input.value);
        saveLocal(storageKey, current);
        updateProgressBars();
      });

      const span = document.createElement('span');
      span.textContent = opt.t;

      labelEl.appendChild(input);
      labelEl.appendChild(span);
      group.appendChild(labelEl);
    });

    li.appendChild(title);
    li.appendChild(group);
    list.appendChild(li);
  });
}

/* ===== Cálculo de puntajes ===== */
function calcScore(storageKey, totalItems){
  const data = readLocal(storageKey) || {};
  let sum = 0, answered = 0;
  for(let i=0;i<totalItems;i++){
    const v = data[`${storageKey}-${i}`];
    if(typeof v === 'number'){ sum += v; answered++ }
  }
  return { sum, answered, total: totalItems };
}

/* Rangos orientativos (no diagnósticos) */
function rangoBDI(sum){
  if(sum <= 13) return 'Mínimo';
  if(sum <= 19) return 'Leve';
  if(sum <= 28) return 'Moderado';
  return 'Severo';
}
function rangoBAI(sum){
  if(sum <= 7) return 'Mínimo';
  if(sum <= 15) return 'Leve';
  if(sum <= 25) return 'Moderado';
  return 'Severo';
}

/* ===== UI resultado ===== */
function showResult(elId, titulo, sum, rango){
  const el = $(elId);
  el.innerHTML = `<strong>${titulo}</strong><span>Puntaje: ${sum} — Rango: ${rango}. Resultados orientativos; consulta a un profesional para interpretación.</span>`;
}

/* ===== Progreso en index ===== */
function updateProgressBars(){
  const bdi = calcScore('bdi', BDI_FULL.length);
  const bai = calcScore('bai', BAI_FULL.length);
  const pbdi = document.getElementById('prog-bdi');
  const pbai = document.getElementById('prog-bai');
  if(pbdi) pbdi.style.width = `${Math.round((bdi.answered / bdi.total) * 100)}%`;
  if(pbai) pbai.style.width = `${Math.round((bai.answered / bai.total) * 100)}%`;
  updateGamify(bdi, bai);
}

/* ===== Gamificación mínima ===== */
function updateGamify(bdi, bai){
  const nivelEl = $('#nivel'); const rachaEl = $('#racha'); const insigniasEl = $('#insignias');
  const completados = (bdi.answered === bdi.total) + (bai.answered === bai.total);
  const nivel = 1 + completados + Math.floor((bdi.answered + bai.answered)/10);
  if(nivelEl) nivelEl.textContent = String(nivel);

  // racha semanal
  const last = readLocal('last-visit');
  const today = new Date();
  if(!last){
    saveLocal('last-visit', { d: todayISO(), streak: 1 });
    if(rachaEl) rachaEl.textContent = '1';
  }else{
    const prev = new Date(last.d);
    const diffDays = Math.floor((today - prev) / (1000*60*60*24));
    const streak = diffDays <= 2 ? (last.streak + 1) : 1; // tolerancia 2 días
    saveLocal('last-visit', { d: todayISO(), streak });
    if(rachaEl) rachaEl.textContent = String(streak);
  }

  const badges = [];
  if(bdi.answered === bdi.total) badges.push('BDI completado');
  if(bai.answered === bai.total) badges.push('BAI completado');
  insigniasEl && (insigniasEl.textContent = badges.length ? badges.join(' · ') : 'Sin insignias aún.');
}

/* ===== Envío a Google Sheets (Apps Script) ===== */
async function sendToSheet(payload){
  try {
    const res = await fetch(CONFIG.sheetEndpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch(err){
    console.error('Error enviando a Sheets', err);
    return { ok: false, error: String(err) };
  }
}

/* ===== Página: BDI ===== */
function initBDI(){
  renderList('#bdi-list', BDI_FULL, 'bdi');
  $('#calcular-bdi')?.addEventListener('click', ()=>{
    const r = calcScore('bdi', BDI_FULL.length);
    showResult('#resultado-bdi', 'Resultado BDI', r.sum, rangoBDI(r.sum));
  });
  $('#guardar-bdi')?.addEventListener('click', async ()=>{
    const r = calcScore('bdi', BDI_FULL.length);
    const payload = {
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BDI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBDI(r.sum),
      respuestas: readLocal('bdi')
    };
    const resp = await sendToSheet(payload);
    alert(resp.ok ? 'Guardado en hoja' : 'No se pudo guardar');
  });
  $('#reiniciar-bdi')?.addEventListener('click', ()=>{
    localStorage.removeItem('bdi');
    renderList('#bdi-list', BDI_FULL, 'bdi');
    $('#resultado-bdi').innerHTML = '';
    updateProgressBars();
  });
}

/* ===== Página: BAI ===== */
function initBAI(){
  fillAlumnoFields();
  renderList('#bai-list', BAI_FULL, 'bai');

  document.getElementById('calcular-bai')?.addEventListener('click', ()=>{
    const r = calcScore('bai', BAI_FULL.length);
    showResult('#resultado-bai', 'Resultado BAI', r.sum, rangoBAI(r.sum));
  });

  document.getElementById('guardar-bai')?.addEventListener('click', async ()=>{
    const r = calcScore('bai', BAI_FULL.length);
    const payload = {
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BAI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBAI(r.sum),
      respuestas: readLocal('bai'),
      alumno: alumnoData(),
      token: 'clave123'
    };
    const resp = await sendToSheet(payload);
    alert(resp.ok ? 'Guardado en hoja' : 'No se pudo guardar');
  });

  document.getElementById('reiniciar-bai')?.addEventListener('click', ()=>{
    localStorage.removeItem('bai');
    renderList('#bai-list', BAI_FULL, 'bai');
    document.getElementById('resultado-bai').innerHTML = '';
    updateProgressBars();
  });
}

/* ===== Página: Index ===== */
function initIndex(){
  $('#reset-bdi')?.addEventListener('click', ()=>{
    localStorage.removeItem('bdi'); updateProgressBars();
  });
  $('#reset-bai')?.addEventListener('click', ()=>{
    localStorage.removeItem('bai'); updateProgressBars();
  });
  updateProgressBars();
}

/* ===== Bootstrap según página ===== */
document.addEventListener('DOMContentLoaded', ()=>{
  const path = location.pathname.toLowerCase();
  if(path.endsWith('beck-depresion.html')) initBDI();
  else if(path.endsWith('beck-ansiedad.html')) initBAI();
  else initIndex();
});

function fillAlumnoFields(){
  const fh = document.getElementById('al-fecha');
  const d = new Date();
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  const fechaFormateada = `${dd}/${mm}/${yyyy}`;
  if(fh) fh.textContent = fechaFormateada;
}

function alumnoData(){
  return {
    fecha_hoy: document.getElementById('al-fecha')?.textContent || '',
    nombre_completo: document.getElementById('al-nombre')?.value || '',
    edad: document.getElementById('al-edad')?.value || '',
    grado_grupo: document.getElementById('al-grado')?.value || ''
  };
}

/* En initBDI y initBAI, llama fillAlumnoFields() */
function initBDI(){
  fillAlumnoFields();
  renderList('#bdi-list', BDI_FULL, 'bdi');

  document.getElementById('calcular-bdi')?.addEventListener('click', ()=>{
    const r = calcScore('bdi', BDI_FULL.length);
    showResult('#resultado-bdi', 'Resultado BDI', r.sum, rangoBDI(r.sum));
  });

  document.getElementById('guardar-bdi')?.addEventListener('click', async ()=>{
    const r = calcScore('bdi', BDI_FULL.length);
    const payload = {
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BDI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBDI(r.sum),
      respuestas: readLocal('bdi'),
      alumno: alumnoData(),
      token: 'clave123' // debe coincidir con el del GAS
    };
    const resp = await sendToSheet(payload);
    alert(resp.ok ? 'Guardado en hoja' : 'No se pudo guardar');
  });

  document.getElementById('reiniciar-bdi')?.addEventListener('click', ()=>{
    localStorage.removeItem('bdi');
    renderList('#bdi-list', BDI_FULL, 'bdi');
    document.getElementById('resultado-bdi').innerHTML = '';
    updateProgressBars();
  });
}

function initBAI(){
  fillAlumnoFields();
  renderList('#bai-list', BAI_FULL, 'bai');

  document.getElementById('calcular-bai')?.addEventListener('click', ()=>{
    const r = calcScore('bai', BAI_FULL.length);
    showResult('#resultado-bai', 'Resultado BAI', r.sum, rangoBAI(r.sum));
  });

  document.getElementById('guardar-bai')?.addEventListener('click', async ()=>{
    const r = calcScore('bai', BAI_FULL.length);
    const payload = {
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BAI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBAI(r.sum),
      respuestas: readLocal('bai'),
      alumno: alumnoData()
    };
    const resp = await sendToSheet(payload);
    alert(resp.ok ? 'Guardado en hoja' : 'No se pudo guardar');
  });

  document.getElementById('reiniciar-bai')?.addEventListener('click', ()=>{
    localStorage.removeItem('bai');
    renderList('#bai-list', BAI_FULL, 'bai');
    document.getElementById('resultado-bai').innerHTML = '';
    updateProgressBars();
  });
}
