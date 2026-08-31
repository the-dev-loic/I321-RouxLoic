const Pizza = require("../../../OneDrive - Education Vaud/Bureau/MyAPI/models/pizza");

/**
 * Valide le payload envoyé pour créer/mettre à jour une pizza.
 * `partial = true` -> utilisé pour le PUT (les champs absents sont ignorés).
 */
function validatePizzaPayload(body, { partial = false } = {}) {
  const errors = [];

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      errors.push("Le champ 'title' est requis et doit être une chaîne non vide.");
    }
  }

  if (!partial || body.price !== undefined) {
    if (typeof body.price !== "number" || Number.isNaN(body.price) || body.price <= 0) {
      errors.push("Le champ 'price' est requis et doit être un nombre positif.");
    }
  }

  if (!partial || body.ingredients !== undefined) {
    if (
      !Array.isArray(body.ingredients) ||
      body.ingredients.length === 0 ||
      !body.ingredients.every((i) => typeof i === "string" && i.trim().length > 0)
    ) {
      errors.push("Le champ 'ingredients' est requis et doit être un tableau de chaînes non vide.");
    }
  }

  if (body.image !== undefined && body.image !== null && typeof body.image !== "string") {
    errors.push("Le champ 'image' doit être une chaîne (URL) ou null.");
  }

  return errors;
}

// GET /pizzas - lister toutes les pizzas
exports.getAllPizzas = (req, res, next) => {
  try {
    const pizzas = Pizza.findAll();
    res.status(200).json(pizzas);
  } catch (err) {
    next(err);
  }
};

// GET /pizzas/:id - afficher une seule pizza
exports.getPizzaById = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "L'identifiant doit être un nombre." });
    }

    const pizza = Pizza.findById(id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: `Aucune pizza trouvée avec l'id ${id}.` });
    }

    res.status(200).json(pizza);
  } catch (err) {
    next(err);
  }
};

// POST /pizzas - ajouter une nouvelle pizza
exports.createPizza = (req, res, next) => {
  try {
    const errors = validatePizzaPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation error", errors });
    }

    const { title, image, ingredients, price } = req.body;

    if (Pizza.findByTitle(title)) {
      return res.status(409).json({
        success: false,
        message: `Une pizza nommée '${title}' existe déjà (le titre doit être unique).`,
      });
    }

    const pizza = Pizza.create({ title, image, ingredients, price });
    res.status(201).json({ success: true, message: "Pizza created successfully", data: pizza });
  } catch (err) {
    next(err);
  }
};

// PUT /pizzas/:id - mettre à jour une pizza (prix, ingrédients, ...)
exports.updatePizza = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "L'identifiant doit être un nombre." });
    }

    if (!Pizza.findById(id)) {
      return res.status(404).json({ success: false, message: `Aucune pizza trouvée avec l'id ${id}.` });
    }

    const errors = validatePizzaPayload(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation error", errors });
    }

    if (req.body.title) {
      const existing = Pizza.findByTitle(req.body.title);
      if (existing && existing.id !== id) {
        return res.status(409).json({
          success: false,
          message: `Une pizza nommée '${req.body.title}' existe déjà (le titre doit être unique).`,
        });
      }
    }

    const pizza = Pizza.update(id, req.body);
    res.status(200).json({ success: true, message: "Pizza updated successfully", data: pizza });
  } catch (err) {
    next(err);
  }
};

// DELETE /pizzas/:id - supprimer une pizza de la carte
exports.deletePizza = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "L'identifiant doit être un nombre." });
    }

    const deleted = Pizza.remove(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Aucune pizza trouvée avec l'id ${id}.` });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
