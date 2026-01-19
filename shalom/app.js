/* ================= CONFIG ================= */
const CONFIG = {
  sheetEndpoint: 'https://script.google.com/macros/s/AKfycbyrd8ZYWj24MHlVcJV2UhmQx3igSM6cx4qgAmZngBAWG_RdTZS-9XQuXArqierxYuqQFA/exec',
  proyecto: 'Encuestas Beck',
  version: '1.0.0'
};

const SECRET = 'clave123';

/* ================= UTILS ================= */
const $ = s => document.querySelector(s);
const saveLocal = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const readLocal = k => JSON.parse(localStorage.getItem(k) || '{}');
const todayISO = () => new Date().toISOString();

/* ===== BDI con opciones completas (0–3) ===== */
const BDI_FULL = [
  {
    q: '1 TRISTEZA', opts: [
      '0 No me siento triste',
      '1 Me siento triste gran parte del tiempo',
      '2 Me siento triste todo el tiempo',
      '3 Me siento tan triste o soy tan infeliz que no puedo soportarlo'
    ]
  },
  {
    q: '2 PESIMISMO', opts: [
      '0 No me siento especialmente desanimado (a) respecto a futuro',
      '1 Me siento desanimado (a) respecto al futuro',
      '2 Siento que no tengo nada que esperar',
      '3 Siento que el futuro es desesperanzador y las cosas no mejoran'
    ]
  },
  {
    q: '3 FRACASO', opts: [
      '0 No me siento fracasado (a)',
      '1 Creo que he fracasado mas que la mayoría de las personas',
      '2 Cuando miro hacia atrás, solo veo fracaso tras fracaso',
      '3 Me siento ya persona totalmente fracasada'
    ]
  },
  {
    q: '4 PÉRDIDA DEL PLACER', opts: [
      '0 Las cosas me satisfacen tanto como antes',
      '1 No disfruto de las cosas tanto como antes',
      '2 Ya no obtengo una satisfacción autentica',
      '3 Estoy insatisfecho o aburrido de todo.'
    ]
  },
  {
    q: '5 SENTIMIENTOS DE CULPA', opts: [
      '0 No me siento especialmente culpable',
      '1 Me siento culpable en bastantes ocasiones',
      '2 Me siento culpable en la mayoría de las ocasiones',
      '3 Me siento culpable constantemente'
    ]
  },
  {
    q: '6 SENTIMIENTOS DE CASTIGO', opts: [
      '0 No creo que este siendo castigado (a)',
      '1 Me siento como si fuese a ser castigado (a)',
      '2 Espero ser castigado (a)',
      '3 Siento que estoy siendo castigado (a)'
    ]
  },
  {
    q: '7 DISCONFORMIDAD CON UNO MISMO', opts: [
      '0 No estoy decepcionado (a) de mi mismo (a)',
      '1 Estoy decepcionado (a) de mi mismo (a)',
      '2 Me da vergüenza de mi mismo (a)',
      '3 Me detesto'
    ]
  },
  {
    q: '8 AUTOCRÍTICA', opts: [
      '0 No me considero peor que cualquier otro (a)',
      '1 Me autocritico por mis debilidades o por mis errores',
      '2 Continuamente me culpo por mis faltas',
      '3 Me culpo por todo lo malo que me sucede'
    ]
  },
  {
    q: '9 PENSAMIENTOS O DESEOS SUICIDAS', opts: [
      '0 No tengo ningún pensamiento de suicidio',
      '1 A veces pienso en suicidarme pero no lo cometería',
      '2 Desearía suicidarme',
      '3 Me suicidaría si tuviera la oportunidad'
    ]
  },
  {
    q: '10 LLANTO', opts: [
      '0 No lloro más de lo que solía',
      '1 Ahora lloro más que antes',
      '2 Lloro continuamente',
      '3 Antes era capaz de llorar, pero ahora no puedo, incluso aunque quiera.'
    ]
  },
  {
    q: '11 AGITACIÓN', opts: [
      '0 No estoy mas inquieto o tenso que lo habitual',
      '1 Me siento mas inquieto o tenso que lo habitual',
      '2 Estoy tan inquieto o agitado que me es difícil quedarme quieto',
      '3 Estoy tan inquieto o agitado que tengo que estar siempre en movimiento o haciendo algo'
    ]
  },
  {
    q: '12 PÉRDIDA DE INTERÉS', opts: [
      '0 No he perdido el interés por los demás',
      '1 Estoy menos interesado en los demás que antes',
      '2 He perdido la mayor parte de mi interés por los demás',
      '3 He perdido todo el interés por los demás'
    ]
  },
  {
    q: '13 INDECISIÓN', opts: [
      '0 Tomo decisiones más o menos como siempre lo he hecho',
      '1 Evito tomar decisiones más que antes',
      '2 Tomar decisiones me resulta mucho más difícil que antes',
      '3 Ya me es imposible tomar decisiones'
    ]
  },
  {
    q: '14 DESVALORIZACIÓN', opts: [
      '0 Me considero valioso (a)',
      '1 No me considero a mi mismo (a) tan valioso (a) y útil como solía considerarme',
      '2 Me siento menos valioso (a) cuando me comparo con otros',
      '3 Siento que no valgo nada'
    ]
  },
  {
    q: '15 PÉRDIDA DE LA ENERGÍA', opts: [
      '0 Tengo tanta energía como siempre',
      '1 Tengo menos energía de la que solía tener',
      '2 No tengo suficiente energía para hacer demasiado',
      '3 No tengo energía suficiente para hacer nada'
    ]
  },
  {
    q: '16 CAMBIOS EN LOS HÁBITOS DE SUEÑO', opts: [
      '0 No he experimentado ningún cambio en mis hábitos de sueño',
      '1 Duermo un poco más de lo habitual o duermo un poco menos de lo habitual',
      '2 Duermo mucho más de lo habitual o duermo mucho menos de lo habitual',
      '3 Duermo la mayor parte del día o me despierto 1’2 horas más temprano y no puedo volver a dormirme'
    ]
  },
  {
    q: '17 IRRITABILIDAD', opts: [
      '0 No estoy mas irritable que lo habitual',
      '1 Estoy más irritable que lo habitual',
      '2 Estoy mucho mas irritable que lo habitual',
      '3 Estoy irritable todo el tiempo'
    ]
  },
  {
    q: '18 CAMBIOS EN EL APETITO', opts: [
      '0 No he experimentado ningún cambio en el apetito',
      '1 Mi apetito es un poco menor que lo habitual o mi apetito es un poco mayor que lo habitual',
      '2 Mi apetito es mucho menor que antes o mi apetito mucho mayor que lo habitual',
      '3 No tengo apetito en lo absoluto o quiero comer todo el día'
    ]
  },
  {
    q: '19 DIFICULTADES DE CONCENTRACIÓN', opts: [
      '0 Me puedo concentrar tan bien como siempre',
      '1 No puedo concentrarme tan bien como habitualmente',
      '2 Me es difícil mantener la mente en algo por mucho tiempo',
      '3 No puedo concentrarme en nada'
    ]
  },
  {
    q: '20 CANSANCIO O FATIGA', opts: [
      '0 No estoy más cansado (a) o fatigado (a) que lo habitual',
      '1 Me fatigo o me canso más fácilmente que lo habitual',
      '2 Estoy demasiado fatigado (a) o cansado (a) para hacer muchas cosas de las que antes solía hacer',
      '3 Estoy demasiado cansado (a) o fatigado (a) para hacer la mayoría de las cosas que solía hacer'
    ]
  },
  {
    q: '21 RENDIMIENTO ESCOLAR', opts: [
      '0 Estudio igual que antes',
      '1 Me cuesta un esfuerzo extra comenzar a hacer algo',
      '2 Tengo que obligarme mucho para hacer algo',
      '3 No puedo hacer nada en lo absoluto'
    ]
  }
];

/* ===== BAI con opciones completas (0–3) ===== */
const BAI_FULL = [
  { q: '1 Torpe o entumecido (a).', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '2 Acalorado (a).', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '3 Con temblor en las piernas.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '4 Incapaz de relajarse.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '5 Con temor a que ocurra lo peor.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '6 Mareado (a) o que se le va la cabeza.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '7 Con latidos del corazón fuertes y acelerados.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '8 Inestable.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '9 Atemorizado (a) o asustado (a).', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '10 Nervioso (a).', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '11 Con sensación de bloqueo.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '12 Con temblores en las manos.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '13 Inquieto (a), inseguro (a).', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '14 Con miedo a perder el control.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '15 Con sensación de ahogo.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '16 Con temor a morir.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '17 Con miedo.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '18 Con problemas digestivos.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '19 Con desvanecimientos.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '20 Te ruborizas constantemente.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] },
  { q: '21 Con sudores, fríos o calientes.', opts: ['0 No', '1 Leve', '2 Moderado', '3 Bastante'] }
];

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
    fecha_hoy: $('#al-fecha')?.textContent || todayISO(),
    nombre_completo: $('#al-nombre')?.value || '',
    edad,
    grado_grupo: $('#al-grado')?.value || ''
  };
}

/* ================= SEND ================= */
async function sendToSheet(payload) {
  console.log(JSON.stringify(payload, null, 2));
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

    const respuestas = respuestasOrdenadas('bdi', BDI_FULL.length);

    if (!respuestas) {
      alert('Debes contestar todas las preguntas');
      return;
    }

    if (!alumno.nombre_completo.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    const payload = {
      fecha_hoy: todayISO(),
      nombre_completo: alumno.nombre_completo,
      edad: alumno.edad,
      grado_grupo: alumno.grado_grupo,
      test: 'BDI',
      puntaje: r.sum,
      rango: rangoBDI(r.sum),
      respuestas, // ← OBJETO 1–21
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

function respuestasOrdenadas(storageKey, total) {
  const data = readLocal(storageKey) || {};
  const out = {};

  for (let i = 0; i < total; i++) {
    if (typeof data[i] !== 'number') {
      return null; // ← faltan respuestas
    }
    out[i + 1] = data[i]; // backend espera 1–21
  }

  return out;
}
