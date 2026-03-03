// ─── SCENE MANAGEMENT ───────────────────────────────────────
const SCENES = ['home', 'caso1', 'caso2', 'transicao', 'caso3', 'fechamento'];
let currentScene = 0;
let sceneRunning = false;

function showScene(index) {
  const prev = document.querySelector('.scene.active');
  if (prev) { prev.classList.remove('active'); prev.classList.add('exit'); setTimeout(() => prev.classList.remove('exit'), 900); }

  const next = document.getElementById(SCENES[index]);
  next.classList.add('active');
  next.scrollTop = 0;
  updateDots(index);
  updateProgress(index);
  sceneRunning = false;

  switch (SCENES[index]) {
    case 'caso1':       animateCaso1(); break;
    case 'caso2':       animateCaso2(); break;
    case 'transicao':   animateTransicao(); break;
    case 'caso3':       animateCaso3(); break;
    case 'fechamento':  animateFechamento(); break;
  }
}

function updateDots(idx) {
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}
function updateProgress(idx) {
  document.getElementById('progress-bar').style.width = `${(idx / (SCENES.length - 1)) * 100}%`;
}

// ─── HOME ────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  updateDots(0); updateProgress(0);
  typewriterHome();
});

function typewriterHome() {
  const phrases = [
    'Você é ético…',
    '…ou só tem medo?'
  ];
  const el = document.getElementById('typing-text');
  let pi = 0, ci = 0, deleting = false, waiting = false;

  // type first phrase, pause, then add second phrase
  let full = phrases[0];
  let target = '';
  let phase = 0; // 0: type p1, 1: pause, 2: type p2, 3: done

  function tick() {
    if (phase === 0) {
      target += full[ci++];
      el.textContent = target;
      if (ci >= full.length) { phase = 1; setTimeout(tick, 1800); return; }
      setTimeout(tick, 55 + Math.random() * 40);
    } else if (phase === 1) {
      // add line break + start typing p2
      target += '\n';
      el.innerHTML = target.replace('\n', '<br/>');
      full = phrases[1]; ci = 0; phase = 2;
      setTimeout(tick, 400);
    } else if (phase === 2) {
      target += full[ci++];
      el.innerHTML = target.replace('\n', '<br/>') ;
      if (ci >= full.length) {
        phase = 3;
        setTimeout(() => {
          const btn = document.getElementById('btn-entrar');
          btn.classList.remove('hidden');
          btn.classList.add('visible');
        }, 700);
        return;
      }
      setTimeout(tick, 55 + Math.random() * 40);
    }
  }
  setTimeout(tick, 600);

  document.getElementById('btn-entrar').addEventListener('click', (e) => {
    e.preventDefault();
    currentScene = 1;
    showScene(currentScene);
  });
}

// ─── GENERIC LINE ANIMATOR ──────────────────────────────────
function animateLines(selector, delayBase = 400, interval = 420, onDone) {
  const lines = document.querySelectorAll(selector);
  lines.forEach((line, i) => {
    if (line.classList.contains('pause') || line.classList.contains('big-pause') ||
        line.classList.contains('pause-lg')) return;
    setTimeout(() => line.classList.add('shown'), delayBase + i * interval);
  });
  const total = lines.length;
  setTimeout(onDone || (() => {}), delayBase + total * interval + 300);
}

// ─── CASO 1 ──────────────────────────────────────────────────
function animateCaso1() {
  const h = document.querySelector('#caso1 h2');
  setTimeout(() => h.classList.add('shown'), 200);

  animateLines('#narrative-amanda .line', 600, 430, () => {
    const q = document.getElementById('q-amanda');
    q.classList.remove('hidden'); q.classList.add('visible');
  });

  document.getElementById('next-caso1').addEventListener('click', () => {
    currentScene = 2; showScene(currentScene);
  }, { once: true });
}

// ─── CASO 2 ──────────────────────────────────────────────────
function animateCaso2() {
  const h = document.querySelector('#caso2 h2');
  setTimeout(() => h.classList.add('shown'), 200);

  animateLines('#narrative-karol .line', 600, 430, () => {
    const q = document.getElementById('q-karol');
    q.classList.remove('hidden'); q.classList.add('visible');
  });

  document.getElementById('next-caso2').addEventListener('click', () => {
    currentScene = 3; showScene(currentScene);
  }, { once: true });
}

// ─── TRANSIÇÃO ──────────────────────────────────────────────
function animateTransicao() {
  animateLines('#trans-lines .t-line', 300, 450, () => {
    const btn = document.getElementById('next-trans');
    btn.classList.remove('hidden'); btn.classList.add('visible');
  });

  document.getElementById('next-trans').addEventListener('click', () => {
    currentScene = 4; showScene(currentScene);
  }, { once: true });
}

// ─── CASO 3 ──────────────────────────────────────────────────
const THREE_PHRASES = [
  `"Você evita fazer o errado porque acredita que é errado…<br/><em>ou acredita que é errado porque aprendeu que será julgado?"</em>`,
  `"Você é contra o bullying porque dói…<br/><em>ou porque ensinaram que é feio admitir que você já riu?"</em>`,
  `"Se a ética só existe quando alguém pode te julgar…<br/><em>então você é ético… ou só tem medo?"</em>`
];

function animateCaso3() {
  const h = document.querySelector('#caso3 h2');
  setTimeout(() => h.classList.add('shown'), 200);
  setTimeout(() => document.querySelector('.fade-text').classList.add('shown'), 400);

  animateLines('#narrative-perfil .line', 900, 420, () => {
    const q = document.getElementById('q-perfil');
    q.classList.remove('hidden'); q.classList.add('visible');

    // inject eth phrases
    const container = document.getElementById('three-phrases');
    THREE_PHRASES.forEach((txt, i) => {
      const div = document.createElement('div');
      div.className = 'eth-phrase';
      div.innerHTML = txt;
      container.appendChild(div);
      setTimeout(() => div.classList.add('shown'), 500 + i * 700);
    });

    // desmonta
    setTimeout(() => {
      const dm = document.getElementById('desmonta');
      dm.classList.remove('hidden'); dm.classList.add('visible');
      document.querySelectorAll('.d-line').forEach((l, i) =>
        setTimeout(() => l.classList.add('shown'), 300 + i * 380)
      );
    }, 500 + THREE_PHRASES.length * 700 + 600);
  });

  document.getElementById('next-caso3').addEventListener('click', () => {
    currentScene = 5; showScene(currentScene);
  }, { once: true });
}

// ─── FECHAMENTO ──────────────────────────────────────────────
function animateFechamento() {
  animateLines('#close-lines .c-line', 400, 520, () => {
    const r = document.getElementById('restart-btn');
    r.classList.remove('hidden'); r.classList.add('visible');
  });
}

window.restartSite = function() {
  // reset all scenes
  document.querySelectorAll('.scene').forEach(s => { s.classList.remove('active','exit'); });
  // reset animations
  document.querySelectorAll('.line, .t-line, .c-line, .d-line, .eth-phrase').forEach(el => el.classList.remove('shown'));
  document.querySelectorAll('h2.reveal, .fade-text').forEach(el => el.classList.remove('shown'));
  document.querySelectorAll('.questions, .desmonta, #restart-btn').forEach(el => { el.classList.add('hidden'); el.classList.remove('visible'); });
  document.getElementById('next-trans').classList.add('hidden'); document.getElementById('next-trans').classList.remove('visible');
  document.getElementById('three-phrases').innerHTML = '';

  // reset home
  document.getElementById('typing-text').textContent = '';
  document.getElementById('btn-entrar').classList.add('hidden'); document.getElementById('btn-entrar').classList.remove('visible');

  currentScene = 0;
  document.getElementById('home').classList.add('active');
  updateDots(0); updateProgress(0);
  typewriterHome();
};
