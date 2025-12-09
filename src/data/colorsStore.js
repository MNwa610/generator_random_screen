const { randomUUID } = require('crypto');

const defaultColors = [
  { id: randomUUID(), name: 'Sky Blue', value: '#4FC3F7', note: 'Calm and airy' },
  { id: randomUUID(), name: 'Mint', value: '#98FF98', note: 'Fresh look' },
  { id: randomUUID(), name: 'Coral', value: '#FF6F61', note: 'Warm accent' },
  { id: randomUUID(), name: 'Midnight', value: '#1B1B2F', note: 'Dark background' },
];

class ColorsStore {
  constructor(seed = []) {
    this.colors = [...seed];
  }

  list(searchTerm) {
    if (!searchTerm) return [...this.colors];
    const lowered = searchTerm.toLowerCase();
    return this.colors.filter(
      (color) =>
        color.name.toLowerCase().includes(lowered) ||
        (color.note && color.note.toLowerCase().includes(lowered))
    );
  }

  get(id) {
    return this.colors.find((color) => color.id === id);
  }

  add({ name, value, note }) {
    const color = { id: randomUUID(), name, value, note: note || '' };
    this.colors.push(color);
    return color;
  }

  update(id, updates) {
    const color = this.get(id);
    if (!color) return null;
    Object.assign(color, updates);
    return color;
  }

  remove(id) {
    const index = this.colors.findIndex((color) => color.id === id);
    if (index === -1) return false;
    this.colors.splice(index, 1);
    return true;
  }

  static randomHex() {
    return `#${cryptoRandomHex(6)}`;
  }

  randomBatch(count) {
    const parsed = Number.parseInt(count, 10);
    const safeCount = Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 30) : 5;
    return Array.from({ length: safeCount }, () => ({
      id: randomUUID(),
      name: 'Generated',
      value: ColorsStore.randomHex(),
    }));
  }
}

function cryptoRandomHex(length) {
  const alphabet = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    const idx = Math.floor(Math.random() * alphabet.length);
    result += alphabet[idx];
  }
  return result;
}

module.exports = new ColorsStore(defaultColors);

