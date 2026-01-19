/* ================= CONFIG ================= */
const CONFIG = {
  sheetEndpoint: 'https://script.google.com/macros/s/AKfycbz3s1jGMaHvlT-I-2gyh8uo_owiUb2uUXyP2fbSi-M86NCLJ7JA82Ik6yqyM6C2qpGwHA/exec',
  proyecto: 'Encuestas Beck',
  version: '1.0.0'
};

const SECRET = 'clave123';

/* ================= UTILS ================= */
const $ = s => document.querySelector(s);
const saveLocal = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const readLocal = k => JSON.parse(localStorage.getItem(k) || '{}');
const todayISO = () => new Date().toISOString();

/* ================= DATA ================= */
const BDI_FULL = [...]; // NO TOQUES, usa tu arreglo completo
const BAI_FULL = [...]; // NO TOQUES, usa tu arreglo completo

/* ================= RENDER ================= */
function renderList(container, items, key) {
  const ul = $(container);
  ul.innerHTML = '';
  const saved = readLocal(key);

  items.forEach((it, i) => {
    const li = document.createElement('li');
    li.className = 'item';

    const title = document.createElement('div');
    title.className = 'item-title';
    title.textContent = it.q;

    const opts = document.createElement('div');
    opts.className = 'item-options';

    it.opts.forEach((txt, v) => {
      const id = `${key}-${i}-${v}`;
      const label = document.createElement('label');
      label.className = 'opt';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `${key}-${i}`;
      input.value = v;
      input.checked = saved[`${i}`] === v;

      input.onchange = () => {
        saved[i] = v;
        saveLocal(key, saved);
      };

      label.append(input, document.createTextNode(txt));
      opts.appendChild(label);
    });

    li.append(title, opts);
    ul.appendChild(li);
  });
}

/* ================= SCORE ================= */
function calcScore(key, total) {
  const d = readLocal(key);
  let sum = 0, answered = 0;
  for (let i = 0; i < total; i++) {
    if (typeof d[i] === 'number') {
      sum += d[i];
      answered++;
    }
  }
  return { sum, answered };
}

const rangoBDI = s => s <= 13 ? 'Mínimo' : s <= 19 ? 'Leve' : s <= 28 ? 'Moderado' : 'Severo';
const rangoBAI = s => s <= 7 ? 'Mínimo' : s <= 15 ? 'Leve' : s <= 25 ? 'Moderado' : 'Severo';

/* ================= ALUMNO ================= */
function alumnoData() {
  const edad = Number($('#edad')?.value);

  if (edad < 12 || edad > 16) {
    alert('La edad debe estar entre 12 y 16 años');
    return null;
  }

  return {
    fecha: $('#al-fecha')?.textContent || todayISO(),
    nombre: $('#al-nombre')?.value || '',
    edad,
    grupo: $('#al-grado')?.value || ''
  };
}

/* ================= SEND ================= */
async function sendToSheet(payload) {
  const res = await fetch(CONFIG.sheetEndpoint, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return JSON.parse(await res.text());
}

/* ================= INIT BDI ================= */
function initBDI() {
  renderList('#bdi-list', BDI_FULL, 'bdi');

  $('#guardar-bdi')?.addEventListener('click', async () => {
    const alumno = alumnoData();
    if (!alumno) return;

    const r = calcScore('bdi', BDI_FULL.length);

    const payload = {
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BDI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBDI(r.sum),
      respuestas: readLocal('bdi'),
      alumno,
      token: SECRET
    };

    const resp = await sendToSheet(payload);
    alert(resp.ok ? 'BDI guardado' : 'Error al guardar');
  });
}

/* ================= INIT BAI ================= */
function initBAI() {
  renderList('#bai-list', BAI_FULL, 'bai');

  $('#guardar-bai')?.addEventListener('click', async () => {
    const alumno = alumnoData();
    if (!alumno) return;

    const r = calcScore('bai', BAI_FULL.length);

    const payload = {
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BAI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBAI(r.sum),
      respuestas: readLocal('bai'),
      alumno,
      token: SECRET
    };

    const resp = await sendToSheet(payload);
    alert(resp.ok ? 'BAI guardado' : 'Error al guardar');
  });
}

/* ================= BOOT ================= */
document.addEventListener('DOMContentLoaded', () => {
  const p = location.pathname.toLowerCase();
  if (p.includes('depresion')) initBDI();
  if (p.includes('ansiedad')) initBAI();
});
