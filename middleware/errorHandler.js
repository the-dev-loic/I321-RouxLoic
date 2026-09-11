/**
 * Middleware pour les routes non trouvées (404).
 */
function notFoundHandler(req, res, next) {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
}

/**
 * Middleware générique de gestion des erreurs non catchées par les contrôleurs.
 */
function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}

module.exports = { notFoundHandler, errorHandler };
