const puzzles = {
  juegos: [
    { clue: '👾🕹️', answer: 'videojuego', hint: 'Pasatiempo digital clásico.' },
    { clue: '⚽🥅', answer: 'futbol', hint: 'Deporte rey.' },
    { clue: '🧩🧠', answer: 'rompecabezas', hint: 'Juego de piezas que encajan.' },
    { clue: '♟️👑', answer: 'ajedrez', hint: 'Estrategia de tablero.' }
  ],
  musica: [
    { clue: '🎸🤘', answer: 'rock', hint: 'Guitarras eléctricas y energía.' },
    { clue: '🎧🎶', answer: 'musica', hint: 'Arte de combinar sonidos.' },
    { clue: '🎤🌟', answer: 'cantante', hint: 'Persona que interpreta canciones.' },
    { clue: '🥁🎺', answer: 'banda', hint: 'Grupo de músicos.' }
  ],
  cultura: [
    { clue: '🎭🏛️', answer: 'teatro', hint: 'Escenario y actuación.' },
    { clue: '📚✍️', answer: 'literatura', hint: 'Arte de la palabra escrita.' },
    { clue: '🖼️🎨', answer: 'arte', hint: 'Expresión creativa visual.' },
    { clue: '🏺🏺', answer: 'historia', hint: 'Estudio del pasado.' }
  ],
  cine: [
    { clue: '🍿🎬', answer: 'cine', hint: 'Pantalla grande y palomitas.' },
    { clue: '🦁👑', answer: 'el rey leon', hint: 'Clásico animado de Disney.' },
    { clue: '🧙‍♂️⚡', answer: 'harry potter', hint: 'Mago con cicatriz en forma de rayo.' },
    { clue: '🚢❄️💔', answer: 'titanic', hint: 'Historia romántica en un transatlántico.' }
  ]
};

const categorySelect = document.getElementById('category');
const categoryTitle = document.getElementById('categoryTitle');
const emojiClue = document.getElementById('emojiClue');
const hint = document.getElementById('hint');
const guessInput = document.getElementById('guess');
const feedback = document.getElementById('feedback');
const winsEl = document.getElementById('wins');
const attemptsEl = document.getElementById('attempts');

let currentPuzzle = null;
let wins = 0;
let attempts = 0;

Object.keys(puzzles).forEach((category) => {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = category[0].toUpperCase() + category.slice(1);
  categorySelect.appendChild(option);
});

const normalize = (text) =>
  text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

function loadPuzzle() {
  const category = categorySelect.value;
  const pool = puzzles[category];
  currentPuzzle = pool[Math.floor(Math.random() * pool.length)];

  categoryTitle.textContent = `Categoría: ${category[0].toUpperCase() + category.slice(1)}`;
  emojiClue.textContent = currentPuzzle.clue;
  hint.textContent = `Pista: ${currentPuzzle.hint}`;
  guessInput.value = '';
  feedback.textContent = '';
  feedback.className = 'feedback';
  guessInput.focus();
}

function checkGuess() {
  if (!currentPuzzle) {
    return;
  }

  attempts += 1;
  attemptsEl.textContent = attempts;

  const guess = normalize(guessInput.value);
  const solution = normalize(currentPuzzle.answer);

  if (guess && guess === solution) {
    wins += 1;
    winsEl.textContent = wins;
    feedback.textContent = '¡Correcto! 🎉';
    feedback.className = 'feedback ok';
  } else {
    feedback.textContent = 'No es correcto, sigue intentando 🙌';
    feedback.className = 'feedback warn';
  }
}

function showAnswer() {
  if (!currentPuzzle) {
    return;
  }

  feedback.textContent = `Respuesta: ${currentPuzzle.answer}`;
  feedback.className = 'feedback warn';
}

document.getElementById('nextBtn').addEventListener('click', loadPuzzle);
document.getElementById('checkBtn').addEventListener('click', checkGuess);
document.getElementById('showBtn').addEventListener('click', showAnswer);
categorySelect.addEventListener('change', loadPuzzle);
guessInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    checkGuess();
  }
});

loadPuzzle();
