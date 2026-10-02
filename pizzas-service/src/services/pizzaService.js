// services/pizzaService.js
// Business logic for pizza compositions: combines the local product_compositions
// table with ingredient data fetched from the ingredients microservice.
const Pizza = require('../entities/Pizza');
const ProductComposition = require('../entities/ProductComposition');
const ingredientsClient = require('./ingredientsClient');

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.status = 409;
    }
}

class UnprocessableError extends Error {
    constructor(message) {
        super(message);
        this.status = 422;
    }
}

async function ensurePizza(pizzaId) {
    const pizza = await Pizza.findById(pizzaId);
    if (!pizza) throw new NotFoundError('Pizza not found');
    return pizza;
}

// Turn a composition row into the API representation, embedding the remote ingredient.
function toCompositionItem(row, ingredient) {
    return {
        ingredientId: row.ingredient_id,
        quantity: row.quantity,
        ingredient, // null if it was deleted from the ingredients service
    };
}

exports.getComposition = async (pizzaId) => {
    await ensurePizza(pizzaId);
    const rows = await ProductComposition.findByPizzaId(pizzaId);
    const ingredients = await Promise.all(rows.map((row) => ingredientsClient.findById(row.ingredient_id)));
    return rows.map((row, i) => toCompositionItem(row, ingredients[i]));
};

exports.getPizzaWithComposition = async (pizzaId) => {
    const pizza = await ensurePizza(pizzaId);
    const ingredients = await exports.getComposition(pizzaId);
    return { ...pizza, ingredients };
};

exports.addIngredient = async (pizzaId, { ingredientId, quantity }) => {
    await ensurePizza(pizzaId);

    const ingredient = await ingredientsClient.findById(ingredientId);
    if (!ingredient) throw new UnprocessableError(`Ingredient ${ingredientId} does not exist`);

    if (await ProductComposition.find(pizzaId, ingredientId)) {
        throw new ConflictError('Ingredient already part of this pizza');
    }

    const row = await ProductComposition.create({ pizzaId, ingredientId, quantity });
    return toCompositionItem(row, ingredient);
};

exports.updateIngredient = async (pizzaId, ingredientId, { quantity }) => {
    await ensurePizza(pizzaId);
    const row = await ProductComposition.update(pizzaId, ingredientId, { quantity });
    if (!row) throw new NotFoundError('Ingredient not part of this pizza');
    const ingredient = await ingredientsClient.findById(ingredientId);
    return toCompositionItem(row, ingredient);
};

exports.removeIngredient = async (pizzaId, ingredientId) => {
    await ensurePizza(pizzaId);
    const deleted = await ProductComposition.delete(pizzaId, ingredientId);
    if (deleted === 0) throw new NotFoundError('Ingredient not part of this pizza');
};
