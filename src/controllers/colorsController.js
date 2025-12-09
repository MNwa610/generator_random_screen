const colorsStore = require('../data/colorsStore');

function isHexColor(value) {
  return /^#?[0-9A-Fa-f]{6}$/.test(value || '');
}

exports.getAll = (req, res) => {
  const { search } = req.query;
  const colors = colorsStore.list(search);
  res.json({ total: colors.length, items: colors });
};

exports.getRandom = (req, res) => {
  const { count } = req.query;
  const colors = colorsStore.randomBatch(count);
  res.json({ generated: colors.length, items: colors });
};

exports.getOne = (req, res) => {
  const { id } = req.params;
  const color = colorsStore.get(id);
  if (!color) {
    return res.status(404).json({ error: 'Color not found' });
  }
  return res.json(color);
};

exports.create = (req, res) => {
  const { name, value, note } = req.body;
  if (!name || !value) {
    return res.status(400).json({ error: 'Name and value are required' });
  }
  if (!isHexColor(value)) {
    return res.status(400).json({ error: 'Value must be a hex color like #A1B2C3' });
  }
  const normalizedValue = value.startsWith('#') ? value.toUpperCase() : `#${value.toUpperCase()}`;
  const color = colorsStore.add({ name, value: normalizedValue, note });
  return res.status(201).json(color);
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { name, value, note } = req.body;
  const existing = colorsStore.get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Color not found' });
  }
  if (value && !isHexColor(value)) {
    return res.status(400).json({ error: 'Value must be a hex color like #A1B2C3' });
  }
  const updated = colorsStore.update(id, {
    name: name || existing.name,
    value: value ? (value.startsWith('#') ? value.toUpperCase() : `#${value.toUpperCase()}`) : existing.value,
    note: note ?? existing.note,
  });
  return res.json(updated);
};

exports.remove = (req, res) => {
  const { id } = req.params;
  const deleted = colorsStore.remove(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Color not found' });
  }
  return res.status(204).send();
};

