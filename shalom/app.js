/* ===== Configuración ===== */
const CONFIG = {
  sheetEndpoint: 'https://script.google.com/macros/s/AKfycbwoOLEJPL12EvzSAt63WolJ7hDWzuzZKQB8u7kMx7Mp9TLar8NMgFKPdTzSUfJW26B6Ig/exec',
  proyecto: 'Encuestas Beck',
  version: '1.0.0'
};
const SECRET = 'clave123';

/* ===== Utilidades ===== */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const saveLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const readLocal = key => JSON.parse(localStorage.getItem(key) || 'null');
const todayISO = () => new Date().toISOString();

/* ===== Ítems =====
   IMPORTANTE: Mantén definidos en tu proyecto estos arrays tal como los tienes:
   - BDI_ITEMS (21 ítems con opts 0–3)
   - BAI_ITEMS (21 ítems con opts 0–3)
   Este archivo asume que ya existen en el scope global.
*/

/* ===== Render dinámico ===== */
function renderList(containerId, items, storageKey) {
  const list = document.querySelector(containerId);
  if (!list) return;
  list.innerHTML = '';
  const saved = readLocal(storageKey) || {};

  items.forEach((entry, idx) => {
    const li = document.createElement('li');
    li.className = 'item';

    const name = `${storageKey}-${idx}`;
    const selected = saved[name] ?? null;

    const title = document.createElement('div');
    title.className = 'item-title';
    title.textContent = entry.q;

    const group = document.createElement('div');
    group.className = 'item-options';

    entry.opts.forEach((t, i) => {
      const id = `${name}-${i}`;
      const labelEl = document.createElement('label');
      labelEl.className = 'opt';
      labelEl.setAttribute('for', id);

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = name;
      input.id = id;
      input.value = String(i);
      if (String(selected) === String(i)) input.checked = true;

      input.addEventListener('change', () => {
        const current = readLocal(storageKey) || {};
        current[name] = Number(input.value);
        saveLocal(storageKey, current);
        updateProgressBars();
      });

      const span = document.createElement('span');
      span.textContent = t;

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
function calcScore(storageKey, totalItems) {
  const data = readLocal(storageKey) || {};
  let sum = 0, answered = 0;
  for (let i = 0; i < totalItems; i++) {
    const v = data[`${storageKey}-${i}`];
    if (typeof v === 'number') { sum += v; answered++; }
  }
  return { sum, answered, total: totalItems };
}

/* ===== Rangos orientativos ===== */
function rangoBDI(sum) {
  if (sum <= 13) return 'Mínimo';
  if (sum <= 19) return 'Leve';
  if (sum <= 28) return 'Moderado';
  return 'Severo';
}
function rangoBAI(sum) {
  if (sum <= 7) return 'Mínimo';
  if (sum <= 15) return 'Leve';
  if (sum <= 25) return 'Moderado';
  return 'Severo';
}

/* ===== UI resultado ===== */
function showResult(elId, titulo, sum, rango) {
  const el = $(elId);
  if (!el) return;
  el.innerHTML = `<strong>${titulo}</strong><span>Puntaje: ${sum} — Rango: ${rango}. Resultados orientativos; consulta a un profesional.</span>`;
}

/* ===== Progreso (index) ===== */
function updateProgressBars() {
  const bdi = calcScore('bdi', (typeof BDI_ITEMS !== 'undefined' ? BDI_ITEMS.length : 21));
  const bai = calcScore('bai', (typeof BAI_ITEMS !== 'undefined' ? BAI_ITEMS.length : 21));
  const pbdi = document.getElementById('prog-bdi');
  const pbai = document.getElementById('prog-bai');
  if (pbdi) pbdi.style.width = `${Math.round((bdi.answered / bdi.total) * 100)}%`;
  if (pbai) pbai.style.width = `${Math.round((bai.answered / bai.total) * 100)}%`;
}

/* ===== Envío a Google Sheets ===== */
async function sendToSheet(payload) {
  try {
    const res = await fetch(CONFIG.sheetEndpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    // Intenta parsear; si no es JSON, devuelve objeto con raw
    try {
      return JSON.parse(text);
    } catch {
      return { ok: /ok/i.test(text), raw: text };
    }
  } catch (err) {
    console.error('Error enviando a Sheets', err);
    return { ok: false, error: String(err) };
  }
}

/* ===== Datos alumno ===== */
function fillAlumnoFields() {
  const fh = document.getElementById('al-fecha');
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const fechaFormateada = `${dd}/${mm}/${yyyy}`;
  if (fh) fh.textContent = fechaFormateada;
}
function alumnoData() {
  return {
    fecha_hoy: document.getElementById('al-fecha')?.textContent || '',
    nombre_completo: document.getElementById('al-nombre')?.value || '',
    edad: document.getElementById('al-edad')?.value || '',
    grado_grupo: document.getElementById('al-grado')?.value || ''
  };
}

/* ===== Validaciones previas ===== */
function validarAntesDeGuardar(storageKey, totalItems) {
  // Edad 12–16
  const edadEl = document.getElementById('al-edad');
  const edad = parseInt(edadEl?.value || '', 10);
  if (isNaN(edad) || edad < 12 || edad > 16) {
    alert('Edad permitida: 12 a 16 años.');
    edadEl && edadEl.focus();
    return false;
  }
  // Todas las respuestas
  const r = calcScore(storageKey, totalItems);
  if (r.answered < r.total) {
    alert('Debes responder todas las preguntas.');
    return false;
  }
  return true;
}

/* ===== Antidoble‑click ===== */
function withButtonLock(btn, fn) {
  return async (...args) => {
    if (!btn) return;
    if (btn.disabled) return; // ya bloqueado
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Guardando...';
    try {
      await fn(...args);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  };
}

/* ===== Página: BDI ===== */
function initBDI() {
  fillAlumnoFields();
  if (typeof BDI_ITEMS === 'undefined') return;
  renderList('#bdi-list', BDI_ITEMS, 'bdi');

  document.getElementById('calcular-bdi')?.addEventListener('click', () => {
    const r = calcScore('bdi', BDI_ITEMS.length);
    showResult('#resultado-bdi', 'Resultado BDI', r.sum, rangoBDI(r.sum));
  });

  const guardarBtn = document.getElementById('guardar-bdi');
  guardarBtn?.addEventListener('click', withButtonLock(guardarBtn, async () => {
    if (!validarAntesDeGuardar('bdi', BDI_ITEMS.length)) return;

    const r = calcScore('bdi', BDI_ITEMS.length);
    const payload = {
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BDI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBDI(r.sum),
      respuestas: readLocal('bdi'),
      alumno: alumnoData(),
      token: SECRET
    };
    const resp = await sendToSheet(payload);
    alert(resp.ok ? 'Guardado en hoja' : 'No se pudo guardar: ' + (resp.error || resp.raw || ''));
  }));

  document.getElementById('reiniciar-bdi')?.addEventListener('click', () => {
    localStorage.removeItem('bdi');
    renderList('#bdi-list', BDI_ITEMS, 'bdi');
    const out = document.getElementById('resultado-bdi');
    if (out) out.innerHTML = '';
    updateProgressBars();
  });
}

/* ===== Página: BAI ===== */
function initBAI() {
  fillAlumnoFields();
  if (typeof BAI_ITEMS === 'undefined') return;
  renderList('#bai-list', BAI_ITEMS, 'bai');

  document.getElementById('calcular-bai')?.addEventListener('click', () => {
    const r = calcScore('bai', BAI_ITEMS.length);
    showResult('#resultado-bai', 'Resultado BAI', r.sum, rangoBAI(r.sum));
  });

  const guardarBtn = document.getElementById('guardar-bai');
  guardarBtn?.addEventListener('click', withButtonLock(guardarBtn, async () => {
    if (!validarAntesDeGuardar('bai', BAI_ITEMS.length)) return;

    const r = calcScore('bai', BAI_ITEMS.length);
    const payload = {
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BAI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBAI(r.sum),
      respuestas: readLocal('bai'),
      alumno: alumnoData(),
      token: SECRET
    };
    const resp = await sendToSheet(payload);
    alert(resp.ok ? 'Guardado en hoja' : 'No se pudo guardar: ' + (resp.error || resp.raw || ''));
  }));

  document.getElementById('reiniciar-bai')?.addEventListener('click', () => {
    localStorage.removeItem('bai');
    renderList('#bai-list', BAI_ITEMS, 'bai');
    const out = document.getElementById('resultado-bai');
    if (out) out.innerHTML = '';
    updateProgressBars();
  });
}

/* ===== Página: Index ===== */
function initIndex() {
  document.getElementById('reset-bdi')?.addEventListener('click', () => {
    localStorage.removeItem('bdi');
    updateProgressBars();
  });
  document.getElementById('reset-bai')?.addEventListener('click', () => {
    localStorage.removeItem('bai');
    updateProgressBars();
  });
  updateProgressBars();
}

/* ===== Bootstrap ===== */
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.toLowerCase();
  if (path.endsWith('beck-depresion.html')) {
    initBDI();
  } else if (path.endsWith('beck-ansiedad.html')) {
    initBAI();
  } else {
    initIndex();
  }
});
