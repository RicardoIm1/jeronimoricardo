/* =========================
   CONFIGURACIÓN GENERAL
========================= */

const CONFIG = {
  proyecto: 'Beck Tests',
  version: '1.0',
  sheetEndpoint: 'https://script.google.com/macros/s/AKfycbxWO2pff3W4B7leHWSwnoURhz2c3_wfuodgIdEhiypvzZaBQJDA-2bXYYlyzVqzZEanBw/exec'
};

const SECRET = 'clave123';

/* =========================
   UTILIDADES BÁSICAS
========================= */

const $ = sel => document.querySelector(sel);

function todayISO() {
  return new Date().toISOString();
}

function readLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* =========================
   ENVÍO A GOOGLE SHEETS
========================= */

function sendToSheet(payload) {
  fetch(CONFIG.sheetEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(payload)
  });
}

/* =========================
   DATOS DEL ALUMNO
========================= */

function fillAlumnoFields() {
  const alumno = readLocal('alumno');

  $('#nombre_completo') && ($('#nombre_completo').value = alumno.nombre_completo || '');
  $('#edad') && ($('#edad').value = alumno.edad || '');
  $('#grado_grupo') && ($('#grado_grupo').value = alumno.grado_grupo || '');
}

function alumnoData() {
  const alumno = {
    nombre_completo: $('#nombre_completo')?.value || '',
    edad: $('#edad')?.value || '',
    grado_grupo: $('#grado_grupo')?.value || ''
  };

  saveLocal('alumno', alumno);
  return alumno;
}

/* =========================
   RENDER DE LISTAS
========================= */

function renderList(container, items, key) {
  const el = $(container);
  if (!el) return;

  const stored = readLocal(key);
  el.innerHTML = '';

  items.forEach((txt, i) => {
    const val = stored[`${key}-${i}`] ?? '';

    el.insertAdjacentHTML('beforeend', `
      <div class="item">
        <label>${i + 1}. ${txt}</label>
        <select data-key="${key}-${i}">
          <option value="">--</option>
          <option value="0" ${val === 0 ? 'selected' : ''}>0</option>
          <option value="1" ${val === 1 ? 'selected' : ''}>1</option>
          <option value="2" ${val === 2 ? 'selected' : ''}>2</option>
          <option value="3" ${val === 3 ? 'selected' : ''}>3</option>
        </select>
      </div>
    `);
  });

  el.querySelectorAll('select').forEach(sel => {
    sel.addEventListener('change', e => {
      const data = readLocal(key);
      const v = e.target.value;
      data[e.target.dataset.key] = v === '' ? '' : Number(v);
      saveLocal(key, data);
      updateProgressBars();
    });
  });
}

/* =========================
   CÁLCULO Y RESULTADOS
========================= */

function calcScore(key, total) {
  const data = readLocal(key);
  let sum = 0;
  let answered = 0;

  for (let i = 0; i < total; i++) {
    const v = data[`${key}-${i}`];
    if (v !== '' && v !== undefined) {
      sum += Number(v);
      answered++;
    }
  }

  return { sum, answered, total };
}

function showResult(container, title, score, range) {
  const el = $(container);
  if (!el) return;

  el.innerHTML = `
    <h3>${title}</h3>
    <p><strong>Puntaje:</strong> ${score}</p>
    <p><strong>Rango:</strong> ${range}</p>
  `;
}

/* =========================
   RANGOS
========================= */

function rangoBDI(s) {
  if (s <= 9) return 'Mínima';
  if (s <= 18) return 'Leve';
  if (s <= 29) return 'Moderada';
  return 'Severa';
}

function rangoBAI(s) {
  if (s <= 7) return 'Mínima';
  if (s <= 15) return 'Leve';
  if (s <= 25) return 'Moderada';
  return 'Severa';
}

/* =========================
   PROGRESO
========================= */

function updateProgressBars() {
  ['bdi', 'bai'].forEach(k => {
    const total = k === 'bdi' ? BDI_ITEMS.length : BAI_ITEMS.length;
    const r = calcScore(k, total);
    const bar = $(`#progress-${k}`);
    if (bar) bar.style.width = `${(r.answered / total) * 100}%`;
  });
}

/* =========================
   ÍTEMS BDI
========================= */

const BDI_ITEMS = [
  'Tristeza',
  'Pesimismo',
  'Fracaso',
  'Pérdida de placer',
  'Sentimientos de culpa',
  'Sentimientos de castigo',
  'Disconformidad con uno mismo',
  'Autocrítica',
  'Pensamientos suicidas',
  'Llanto',
  'Agitación',
  'Pérdida de interés',
  'Indecisión',
  'Desvalorización',
  'Pérdida de energía',
  'Cambios en el sueño',
  'Irritabilidad',
  'Cambios en el apetito',
  'Dificultad de concentración',
  'Cansancio o fatiga',
  'Rendimiento escolar'
];

/* =========================
   ÍTEMS BAI
========================= */

const BAI_ITEMS = [
  'Torpe o entumecido',
  'Acalorado',
  'Temblor en las piernas',
  'Incapaz de relajarse',
  'Temor a que ocurra lo peor',
  'Mareado o aturdido',
  'Latidos acelerados',
  'Inestable',
  'Atemorizado',
  'Nervioso',
  'Sensación de bloqueo',
  'Temblores en las manos',
  'Inquietud',
  'Miedo a perder el control',
  'Sensación de ahogo',
  'Temor a morir',
  'Con miedo',
  'Problemas digestivos',
  'Desvanecimientos',
  'Ruborización',
  'Sudores'
];

/* =========================
   INIT BDI
========================= */

function initBDI() {
  fillAlumnoFields();
  renderList('#bdi-list', BDI_ITEMS, 'bdi');

  $('#calcular-bdi')?.addEventListener('click', () => {
    const r = calcScore('bdi', BDI_ITEMS.length);
    showResult('#resultado-bdi', 'Resultado BDI', r.sum, rangoBDI(r.sum));
  });

  $('#guardar-bdi')?.addEventListener('click', () => {
    const r = calcScore('bdi', BDI_ITEMS.length);

    sendToSheet({
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BDI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBDI(r.sum),
      respuestas: readLocal('bdi'),
      alumno: alumnoData(),
      token: SECRET
    });

    alert('Resultados enviados correctamente.');
  });

  $('#reiniciar-bdi')?.addEventListener('click', () => {
    localStorage.removeItem('bdi');
    renderList('#bdi-list', BDI_ITEMS, 'bdi');
    $('#resultado-bdi').innerHTML = '';
    updateProgressBars();
  });
}

/* =========================
   INIT BAI
========================= */

function initBAI() {
  fillAlumnoFields();
  renderList('#bai-list', BAI_ITEMS, 'bai');

  $('#calcular-bai')?.addEventListener('click', () => {
    const r = calcScore('bai', BAI_ITEMS.length);
    showResult('#resultado-bai', 'Resultado BAI', r.sum, rangoBAI(r.sum));
  });

  $('#guardar-bai')?.addEventListener('click', () => {
    const r = calcScore('bai', BAI_ITEMS.length);

    sendToSheet({
      proyecto: CONFIG.proyecto,
      version: CONFIG.version,
      test: 'BAI',
      timestamp: todayISO(),
      puntaje: r.sum,
      rango: rangoBAI(r.sum),
      respuestas: readLocal('bai'),
      alumno: alumnoData(),
      token: SECRET
    });

    alert('Resultados enviados correctamente.');
  });

  $('#reiniciar-bai')?.addEventListener('click', () => {
    localStorage.removeItem('bai');
    renderList('#bai-list', BAI_ITEMS, 'bai');
    $('#resultado-bai').innerHTML = '';
    updateProgressBars();
  });
}

/* =========================
   INIT INDEX
========================= */

function initIndex() {
  updateProgressBars();
}

/* =========================
   BOOTSTRAP FINAL
========================= */

document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.toLowerCase();

  if (path.endsWith('beck-depresion.html')) initBDI();
  else if (path.endsWith('beck-ansiedad.html')) initBAI();
  else initIndex();
});
