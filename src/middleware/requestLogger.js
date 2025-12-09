function requestLogger(req, res, next) {
  const startedAt = Date.now();
  const { method, originalUrl } = req;
  const query = Object.keys(req.query || {}).length ? `?${new URLSearchParams(req.query).toString()}` : '';
  console.info(`[${new Date().toISOString()}] ${method} ${originalUrl}${query}`);

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    console.info(`↳ ${method} ${originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}

module.exports = requestLogger;

