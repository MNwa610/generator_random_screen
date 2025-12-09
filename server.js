const express = require('express');
const path = require('path');
const requestLogger = require('./src/middleware/requestLogger');
const colorRoutes = require('./src/routes/colorRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/colors', colorRoutes);

app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  return next();
});


app.use((err, req, res, _next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Color generator API running at http://localhost:${PORT}`);
});

