const express = require("express");
const router = express.Router();
const pizzaController = require("../controllers/pizzas");

/**
 * Ressource : /api/pizzas
 * Chaque route délègue uniquement au controller correspondant.
 */

// GET    /api/pizzas       -> lister les pizzas
router.get("/", pizzaController.getAllPizzas);

// GET    /api/pizzas/:id   -> afficher une pizza
router.get("/:id", pizzaController.getPizzaById);

// POST   /api/pizzas       -> ajouter une pizza
router.post("/", pizzaController.createPizza);

// PUT    /api/pizzas/:id   -> mettre à jour une pizza
router.put("/:id", pizzaController.updatePizza);

// DELETE /api/pizzas/:id   -> supprimer une pizza
router.delete("/:id", pizzaController.deletePizza);

module.exports = router;
