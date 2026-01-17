/* ===== Configuración ===== */
const CONFIG = {
  sheetEndpoint: 'https://script.google.com/macros/s/AKfycbw4Qh8h3YUYYw3MRknTYzVb2Ex1bZz28P2xz6J-PGRp0OSP1_d4b1R8VOjzJh8x1pwSCQ/exec', // reemplaza con tu URL publicada de Apps Script
  proyecto: 'Encuestas Beck',
  version: '1.0.0'
};

/* ===== Utilidades ===== */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const saveLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const readLocal = key => JSON.parse(localStorage.getItem(key) || 'null');
const todayISO = () => new Date().toISOString();

/* ===== Ítems (texto simplificado y neutral) ===== */
/* BDI: 21 ítems */
const BDI_ITEMS = [
  'Tristeza', 'Pesimismo', 'Fracaso', 'Pérdida de placer', 'Sentimientos de culpa',
  'Sentimientos de castigo', 'Disconformidad con uno mismo', 'Autocrítica',
  'Pensamientos o deseos de muerte', 'Llanto', 'Agitación', 'Pérdida de interés',
  'Indecisión', 'Desvalorización', 'Pérdida de energía', 'Cambios en el sueño',
  'Irritabilidad', 'Cambios en el apetito', 'Dificultad de concentración',
  'Cansancio', 'Pérdida de interés sexual'
];

/* BAI: 20 ítems */
const BAI_ITEMS = [
  'Entumecimiento u hormigueo', 'Sensación de calor', 'Debilidad en las piernas',
  'Incapacidad para relajarse', 'Miedo a que ocurra lo peor', 'Mareos o aturdimiento',
  'Palpitaciones o aceleración del corazón', 'Inestabilidad', 'Temblor en las manos',
  'Inquietud', 'Dificultad para respirar', 'Miedo a perder el control',
  'Sensación de ahogo', 'Temblor', 'Nerviosismo', 'Indigestión o malestar abdominal',
  'Desvanecimiento', 'Rubor facial', 'Sudoración', 'Miedo'
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
  const list = $(containerId);
  list.innerHTML = '';
  const saved = readLocal(storageKey) || {};
  items.forEach((label, idx) => {
    const li = document.createElement('li');
    li.className = 'item';
    const name = `${storageKey}-${idx}`;
    const selected = saved[name] ?? null;

    const title = document.createElement('div');
    title.className = 'item-title';
    title.textContent = `${idx + 1}. ${label}`;

    const group = document.createElement('div');
    group.className = 'item-options';

    OPTIONS.forEach(opt => {
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
  const bdi = calcScore('bdi', BDI_ITEMS.length);
  const bai = calcScore('bai', BAI_ITEMS.length);
  const pbdi = $('#prog-bdi'); const pbai = $('#prog-bai');
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
  if(!CONFIG.sheetEndpoint || CONFIG.sheetEndpoint.includes('PASTE')){
    alert('Configura CONFIG.sheetEndpoint con tu URL de Apps Script publicada.');
    return { ok: false };
  }
  try{
    const res = await fetch(CONFIG.sheetEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({ ok: res.ok }));
    return data;
  }catch(err){
    console.error('Error enviando a Sheets', err);
    return { ok: false, error: String(err) };
  }
}

/* ===== Página: BDI ===== */
function initBDI(){
  renderList('#bdi-list', BDI_ITEMS, 'bdi');
  $('#calcular-bdi')?.addEventListener('click', ()=>{
    const r = calcScore('bdi', BDI_ITEMS.length);
    showResult('#resultado-bdi', 'Resultado BDI', r.sum, rangoBDI(r.sum));
  });
  $('#guardar-bdi')?.addEventListener('click', async ()=>{
    const r = calcScore('bdi', BDI_ITEMS.length);
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
    renderList('#bdi-list', BDI_ITEMS, 'bdi');
    $('#resultado-bdi').innerHTML = '';
    updateProgressBars();
  });
}

/* ===== Página: BAI ===== */
function initBAI(){
  renderList('#bai-list', BAI_ITEMS, 'bai');
  $('#calcular-bai')?.addEventListener('click', ()=>{
    const r = calcScore('bai', BAI_ITEMS.length);
    showResult('#resultado-bai', 'Resultado BAI', r.sum, rangoBAI(r.sum));
  });
  $('#guardar-bai')?.addEventListener('click', async ()=>{
    const r = calcScore('bai', BAI_ITEMS.length);
    const payload = {
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BAI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBAI(r.sum),
      respuestas: readLocal('bai')
    };
    const resp = await sendToSheet(payload);
    alert(resp.ok ? 'Guardado en hoja' : 'No se pudo guardar');
  });
  $('#reiniciar-bai')?.addEventListener('click', ()=>{
    localStorage.removeItem('bai');
    renderList('#bai-list', BAI_ITEMS, 'bai');
    $('#resultado-bai').innerHTML = '';
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
