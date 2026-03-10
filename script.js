const crosswords = {
  juegos: {
    title: 'Juegos',
    size: 12,
    words: [
      { number: 1, answer: 'AJEDREZ', clue: '♟️👑', row: 1, col: 1, dir: 'across' },
      { number: 2, answer: 'FUTBOL', clue: '⚽🥅', row: 0, col: 4, dir: 'down' },
      { number: 3, answer: 'ROMPECABEZAS', clue: '🧩🧠', row: 4, col: 0, dir: 'across' },
      { number: 4, answer: 'VIDEOJUEGO', clue: '👾🕹️', row: 0, col: 8, dir: 'down' },
      { number: 5, answer: 'DADOS', clue: '🎲🎲', row: 8, col: 2, dir: 'across' },
      { number: 6, answer: 'CARTAS', clue: '🃏♥️', row: 6, col: 10, dir: 'down' }
    ]
  },
  musica: {
    title: 'Música',
    size: 12,
    words: [
      { number: 1, answer: 'ROCK', clue: '🎸🤘', row: 0, col: 2, dir: 'down' },
      { number: 2, answer: 'BANDA', clue: '🥁🎺', row: 3, col: 1, dir: 'across' },
      { number: 3, answer: 'CANTANTE', clue: '🎤🌟', row: 1, col: 6, dir: 'down' },
      { number: 4, answer: 'MUSICA', clue: '🎧🎶', row: 7, col: 1, dir: 'across' },
      { number: 5, answer: 'PIANO', clue: '🎹🎼', row: 5, col: 9, dir: 'down' },
      { number: 6, answer: 'RITMO', clue: '🕺💃', row: 10, col: 3, dir: 'across' }
    ]
  },
  cultura: {
    title: 'Cultura',
    size: 12,
    words: [
      { number: 1, answer: 'ARTE', clue: '🖼️🎨', row: 1, col: 1, dir: 'across' },
      { number: 2, answer: 'TEATRO', clue: '🎭🏛️', row: 0, col: 3, dir: 'down' },
      { number: 3, answer: 'HISTORIA', clue: '🏺📜', row: 4, col: 1, dir: 'across' },
      { number: 4, answer: 'LITERATURA', clue: '📚✍️', row: 0, col: 8, dir: 'down' },
      { number: 5, answer: 'DANZA', clue: '💃🩰', row: 9, col: 2, dir: 'across' },
      { number: 6, answer: 'MUSEO', clue: '🗿🏛️', row: 6, col: 10, dir: 'down' }
    ]
  },
  cine: {
    title: 'Cine',
    size: 12,
    words: [
      { number: 1, answer: 'CINE', clue: '🍿🎬', row: 1, col: 1, dir: 'across' },
      { number: 2, answer: 'TITANIC', clue: '🚢❄️💔', row: 0, col: 4, dir: 'down' },
      { number: 3, answer: 'HARRYPOTTER', clue: '🧙‍♂️⚡', row: 4, col: 0, dir: 'across' },
      { number: 4, answer: 'REYLEON', clue: '🦁👑', row: 0, col: 9, dir: 'down' },
      { number: 5, answer: 'DRAMA', clue: '😭🎭', row: 8, col: 2, dir: 'across' },
      { number: 6, answer: 'ACTOR', clue: '🎬⭐', row: 6, col: 11, dir: 'down' }
    ]
  }
};

const categorySelect = document.getElementById('category');
const categoryTitle = document.getElementById('categoryTitle');
const crosswordEl = document.getElementById('crossword');
const cluesList = document.getElementById('cluesList');
const feedback = document.getElementById('feedback');
const winsEl = document.getElementById('wins');
const attemptsEl = document.getElementById('attempts');

let active = null;
let gridMeta = [];
let wins = 0;
let attempts = 0;

Object.keys(crosswords).forEach((category) => {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = crosswords[category].title;
  categorySelect.appendChild(option);
});

function assertInsideGrid(size, row, col) {
  return row >= 0 && col >= 0 && row < size && col < size;
}

function buildSolutionMap(config) {
  const cells = new Map();

  config.words.forEach((word) => {
    for (let i = 0; i < word.answer.length; i += 1) {
      const row = word.dir === 'across' ? word.row : word.row + i;
      const col = word.dir === 'across' ? word.col + i : word.col;
      const key = `${row}-${col}`;
      const value = word.answer[i];

      if (!assertInsideGrid(config.size, row, col)) {
        throw new Error(`La palabra ${word.answer} se sale de la cuadrícula en ${key}`);
      }

      if (cells.has(key) && cells.get(key) !== value) {
        throw new Error(`Conflicto de letras en ${key}`);
      }
      cells.set(key, value);
    }
  });

  return cells;
}

function renderCrossword() {
  active = crosswords[categorySelect.value];
  let solution;

  try {
    solution = buildSolutionMap(active);
  } catch (error) {
    feedback.textContent = `Error de configuración: ${error.message}`;
    feedback.className = 'feedback warn';
    return;
  }

  gridMeta = [];
  categoryTitle.textContent = `Categoría: ${active.title}`;
  crosswordEl.innerHTML = '';
  cluesList.innerHTML = '';
  feedback.textContent = '';
  feedback.className = 'feedback';

  crosswordEl.style.setProperty('--size', active.size);

  for (let r = 0; r < active.size; r += 1) {
    for (let c = 0; c < active.size; c += 1) {
      const key = `${r}-${c}`;
      const cell = document.createElement('div');
      cell.className = 'cell';

      if (solution.has(key)) {
        const input = document.createElement('input');
        input.maxLength = 1;
        input.dataset.row = String(r);
        input.dataset.col = String(c);
        input.className = 'letter';
        input.setAttribute('aria-label', `Fila ${r + 1}, columna ${c + 1}`);

        input.addEventListener('input', (event) => {
          event.target.value = event.target.value.toUpperCase().replace(/[^A-ZÑ]/g, '');
        });

        cell.appendChild(input);
        gridMeta.push({ row: r, col: c, answer: solution.get(key), input });
      } else {
        cell.classList.add('block');
      }

      const clueStart = active.words.find((w) => w.row === r && w.col === c);
      if (clueStart && solution.has(key)) {
        const badge = document.createElement('span');
        badge.className = 'num';
        badge.textContent = String(clueStart.number);
        cell.appendChild(badge);
      }

      crosswordEl.appendChild(cell);
    }
  }

  active.words
    .slice()
    .sort((a, b) => a.number - b.number)
    .forEach((word) => {
      const item = document.createElement('li');
      item.textContent = `${word.number}. ${word.clue} (${word.dir === 'across' ? 'Horizontal' : 'Vertical'}, ${word.answer.length} letras)`;
      cluesList.appendChild(item);
    });

  const first = crosswordEl.querySelector('.letter');
  if (first) first.focus();
}

function checkCrossword() {
  attempts += 1;
  attemptsEl.textContent = attempts;

  const allCorrect = gridMeta.every(({ input, answer }) => input.value.toUpperCase() === answer);

  if (allCorrect) {
    wins += 1;
    winsEl.textContent = wins;
    feedback.textContent = '¡Crucigrama completo y correcto! 🎉';
    feedback.className = 'feedback ok';
    return;
  }

  feedback.textContent = 'Todavía faltan letras o hay errores. Completa todo el crucigrama 💪';
  feedback.className = 'feedback warn';
}

function revealCrossword() {
  gridMeta.forEach(({ input, answer }) => {
    input.value = answer;
  });
  feedback.textContent = 'Solución completa mostrada.';
  feedback.className = 'feedback warn';
}

function clearCrossword() {
  gridMeta.forEach(({ input }) => {
    input.value = '';
  });
  feedback.textContent = '';
  feedback.className = 'feedback';
}

document.getElementById('loadBtn').addEventListener('click', renderCrossword);
document.getElementById('checkBtn').addEventListener('click', checkCrossword);
document.getElementById('revealBtn').addEventListener('click', revealCrossword);
document.getElementById('clearBtn').addEventListener('click', clearCrossword);
categorySelect.addEventListener('change', renderCrossword);

renderCrossword();
