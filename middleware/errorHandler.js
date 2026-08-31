// Middleware 404 - déclenché quand aucune route ne correspond
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
}

// Middleware d'erreur générique - capture toute erreur inattendue (500)
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}

module.exports = { notFoundHandler, errorHandler };
