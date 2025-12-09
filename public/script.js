const colorsGrid = document.getElementById('colorsGrid');
const randomBtn = document.getElementById('randomBtn');
const applyBtn = document.getElementById('applyBtn');
const createForm = document.getElementById('createForm');
const createMessage = document.getElementById('createMessage');
const countInput = document.getElementById('countInput');

let currentColors = [];
let selectedColor = null;

async function fetchRandomColors() {
  const count = Number(countInput.value) || 5;
  const res = await fetch(`/api/colors/random?count=${count}`);
  const data = await res.json();
  currentColors = data.items;
  renderColors();
}

function renderColors() {
  colorsGrid.innerHTML = '';
  currentColors.forEach((color) => {
    const card = document.createElement('div');
    card.className = 'color-card';
    card.dataset.id = color.id;
    card.addEventListener('click', () => {
      selectedColor = color.value;
      highlightSelection(color.id);
    });

    card.innerHTML = `
      <div class="swatch" style="background:${color.value}">
        <span>${color.value}</span>
      </div>
      <div class="color-meta">
        <h3>${color.name || 'Без названия'}</h3>
        <p>${color.note || 'Нет заметки'}</p>
      </div>
    `;

    colorsGrid.appendChild(card);
  });
}

function highlightSelection(id) {
  document.querySelectorAll('.color-card').forEach((card) => {
    card.style.borderColor = card.dataset.id === id ? '#7c3aed' : '#1f2937';
  });
}

applyBtn.addEventListener('click', () => {
  if (!selectedColor) return;
  document.body.style.background = selectedColor;
});

randomBtn.addEventListener('click', fetchRandomColors);

createForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(createForm);
  const payload = Object.fromEntries(formData.entries());

  const res = await fetch('/api/colors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    createMessage.textContent = data.error || 'Ошибка сохранения';
    createMessage.style.color = '#f87171';
    return;
  }

  createMessage.textContent = `Сохранено: ${data.name} (${data.value})`;
  createMessage.style.color = '#22c55e';
  createForm.reset();
});

fetchRandomColors();

