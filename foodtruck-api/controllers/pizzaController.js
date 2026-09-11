const { validationResult } = require('express-validator');
const Pizza = require('../entities/Pizza');

/**
 * Controller fonctions utilisant la signature Express (req, res, next).
 * Les codes de retour suivent les recommandations MDN/HTTP.
 */

// Méthode exploitée dans le cas d'un POST (en provenance de routes/pizzas.js)
exports.create = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // 400 Bad Request en cas de problème de validation
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, ingredients, imageUrl, price } = req.body;
        const created = await Pizza.create({ name, ingredients, imageUrl, price });
        // 201 Created
        return res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

// Méthode exploitée dans le cas d'un GET ALL (en provenance de routes/pizzas.js)
exports.findAll = async (req, res, next) => {
    try {
        const pizzas = await Pizza.findAll();
        // 200 OK
        return res.status(200).json(pizzas);
    } catch (err) {
        next(err);
    }
};

// Méthode exploitée dans le cas d'un GET by ID (en provenance de routes/pizzas.js)
exports.findOne = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const pizza = await Pizza.findById(id);
        if (!pizza) return res.status(404).json({ error: 'Pizza not found' }); // 404 Not Found

        return res.status(200).json(pizza);
    } catch (err) {
        next(err);
    }
};

// Méthode exploitée dans le cas d'un PUT (en provenance de routes/pizzas.js)
exports.update = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const { name, ingredients, imageUrl, price } = req.body;
        const updated = await Pizza.update(id, { name, ingredients, imageUrl, price });
        if (!updated) return res.status(404).json({ error: 'Pizza not found' }); // 404 Not Found

        return res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// Méthode exploitée dans le cas d'un DELETE (en provenance de routes/pizzas.js)
exports.delete = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const deleted = await Pizza.delete(id);
        if (deleted === 0) return res.status(404).json({ error: 'Pizza not found' });

        // 204 No Content en cas de succès
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};
