/* =============================
   CONFIGURACIÓN
============================= */
const CONFIG = {
  sheetEndpoint: 'https://script.google.com/macros/s/AKfycbyDw9N6FLIlCDAfzuhLZBp6r66pHZOl5waUysdHYNBGYk5v_MGi71kJWPmTM8-3RdYNNA/exec',
  proyecto: 'Encuestas Beck',
  version: '1.0.0'
};

const SECRET = 'clave123';

/* =============================
   UTILIDADES
============================= */
const $ = s => document.querySelector(s);
const saveLocal = (k, d) => localStorage.setItem(k, JSON.stringify(d));
const readLocal = k => JSON.parse(localStorage.getItem(k) || 'null');
const todayISO = () => new Date().toISOString();

/* =============================
   ÍTEMS BDI
============================= */
const BDI_ITEMS = [ /* === TAL CUAL LOS PUSISTE === */ 
  { q:'1 TRISTEZA',opts:['0 No me siento triste','1 Me siento triste gran parte del tiempo','2 Me siento triste todo el tiempo','3 No lo soporto']},
  { q:'2 PESIMISMO',opts:['0 No','1 Algo','2 Mucho','3 Total']},
  { q:'3 FRACASO',opts:['0 No','1 Algo','2 Mucho','3 Total']},
  { q:'4 PLACER',opts:['0 Igual','1 Menos','2 Casi nada','3 Nada']},
  { q:'5 CULPA',opts:['0 No','1 Algo','2 Mucho','3 Siempre']},
  { q:'6 CASTIGO',opts:['0 No','1 Tal vez','2 Espero','3 Seguro']},
  { q:'7 AUTOIMAGEN',opts:['0 Bien','1 Regular','2 Mal','3 Muy mal']},
  { q:'8 AUTOCRÍTICA',opts:['0 No','1 A veces','2 Mucho','3 Siempre']},
  { q:'9 SUICIDIO',opts:['0 No','1 Pensado','2 Deseado','3 Haría']},
  { q:'10 LLANTO',opts:['0 Normal','1 Más','2 Siempre','3 No puedo']},
  { q:'11 AGITACIÓN',opts:['0 No','1 Leve','2 Fuerte','3 Constante']},
  { q:'12 INTERÉS',opts:['0 Igual','1 Menos','2 Poco','3 Nada']},
  { q:'13 DECISIONES',opts:['0 Normal','1 Difícil','2 Mucho','3 Imposible']},
  { q:'14 VALOR',opts:['0 Valioso','1 Menos','2 Poco','3 Nada']},
  { q:'15 ENERGÍA',opts:['0 Normal','1 Menos','2 Muy poca','3 Nada']},
  { q:'16 SUEÑO',opts:['0 Normal','1 Leve','2 Mucho','3 Grave']},
  { q:'17 IRRITABLE',opts:['0 No','1 Algo','2 Mucho','3 Siempre']},
  { q:'18 APETITO',opts:['0 Normal','1 Leve','2 Mucho','3 Extremo']},
  { q:'19 CONCENTRACIÓN',opts:['0 Normal','1 Difícil','2 Mucho','3 Nada']},
  { q:'20 FATIGA',opts:['0 No','1 Algo','2 Mucho','3 Total']},
  { q:'21 RENDIMIENTO',opts:['0 Normal','1 Difícil','2 Forzado','3 Nulo']}
];

/* =============================
   ÍTEMS BAI
============================= */
const BAI_ITEMS = [
  { q: 'Entumecimiento u hormigueo', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Sensación de calor', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Temblor en las piernas', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Incapacidad para relajarse', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Miedo a que ocurra lo peor', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Mareo o aturdimiento', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Latidos acelerados', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Inestabilidad', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Sensación de terror', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Nerviosismo', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Sensación de ahogo', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Manos temblorosas', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Temblor generalizado', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Miedo a perder el control', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Dificultad para respirar', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Miedo a morir', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Sensación de miedo', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Indigestión o malestar abdominal', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Sensación de desmayo', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Rubor facial', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] },
  { q: 'Sudoración', opts: ['0 Nada', '1 Leve', '2 Moderado', '3 Severo'] }
];

/* =============================
   RENDER
============================= */
function renderList(id, items, key) {
  const ul = $(id);
  ul.innerHTML = '';
  const saved = readLocal(key) || {};

  items.forEach((it, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${it.q}</strong>`;
    it.opts.forEach((t, v) => {
      const name = `${key}-${i}`;
      li.innerHTML += `
        <label>
          <input type="radio" name="${name}" value="${v}"
          ${saved[name] === v ? 'checked' : ''}>
          ${t}
        </label>`;
    });
    ul.appendChild(li);
  });

  ul.addEventListener('change', e => {
    if (e.target.type === 'radio') {
      const d = readLocal(key) || {};
      d[e.target.name] = Number(e.target.value);
      saveLocal(key, d);
    }
  });
}

/* =============================
   CÁLCULOS
============================= */
function calcScore(key, total) {
  const d = readLocal(key) || {};
  let sum = 0, a = 0;
  for (let i = 0; i < total; i++) {
    const v = d[`${key}-${i}`];
    if (typeof v === 'number') { sum += v; a++; }
  }
  return { sum, a, total };
}

const rangoBDI = s => s <= 13 ? 'Mínimo' : s <= 19 ? 'Leve' : s <= 28 ? 'Moderado' : 'Severo';
const rangoBAI = s => s <= 7 ? 'Mínimo' : s <= 15 ? 'Leve' : s <= 25 ? 'Moderado' : 'Severo';

/* =============================
   ENVÍO (CORS SAFE)
============================= */
function sendToSheet(payload) {
  fetch(CONFIG.sheetEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(payload)
  });
}

/* =============================
   ALUMNO
============================= */
function alumnoData() {
  return {
    nombre: $('#al-nombre')?.value || '',
    edad: $('#al-edad')?.value || '',
    grupo: $('#al-grado')?.value || '',
    fecha: todayISO()
  };
}

/* =============================
   INIT
============================= */
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.toLowerCase();

  if (path.includes('beck-depresion')) {
    renderList('#bdi-list', BDI_ITEMS, 'bdi');
    $('#guardar-bdi')?.addEventListener('click', () => {
      const r = calcScore('bdi', BDI_ITEMS.length);
      sendToSheet({ test:'BDI', puntaje:r.sum, rango:rangoBDI(r.sum), alumno:alumnoData(), token:SECRET });
      alert('BDI enviado');
    });
  }

  if (path.includes('beck-ansiedad')) {
    renderList('#bai-list', BAI_ITEMS, 'bai');
    $('#guardar-bai')?.addEventListener('click', () => {
      const r = calcScore('bai', BAI_ITEMS.length);
      sendToSheet({ test:'BAI', puntaje:r.sum, rango:rangoBAI(r.sum), alumno:alumnoData(), token:SECRET });
      alert('BAI enviado');
    });
  }
});
