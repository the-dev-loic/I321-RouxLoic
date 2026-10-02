// routes/pizzas.js
const express = require('express');
const { body, param } = require('express-validator');
const pizzaController = require('../controllers/pizzaController');

const router = express.Router();

/**
 * @openapi
 * /api/v1/pizzas:
 *   get:
 *     summary: Retrieve a list of pizza
 *     responses:
 *       200:
 *         description: A list of pizza
 *   post:
 *     summary: Create a new pizza
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: pizza created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/v1/pizzas/{id}:
 *   get:
 *     summary: Get a pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single pizza
 *       404:
 *         description: pizza not found
 *   put:
 *     summary: Update a pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: pizza updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: pizza not found
 *   delete:
 *     summary: Delete a pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: pizza deleted
 *       404:
 *         description: pizza not found
 */

/**
 * @openapi
 * /api/v1/pizzas/{id}/ingredients:
 *   get:
 *     summary: Get the composition of a pizza (ingredients fetched from the ingredients service)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of { ingredientId, quantity, ingredient }
 *       404:
 *         description: pizza not found
 *       503:
 *         description: ingredients service unavailable
 *   post:
 *     summary: Add an ingredient to a pizza
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ingredientId
 *             properties:
 *               ingredientId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: ingredient added to the pizza
 *       400:
 *         description: Invalid input
 *       404:
 *         description: pizza not found
 *       409:
 *         description: ingredient already part of this pizza
 *       422:
 *         description: ingredient does not exist in the ingredients service
 *       503:
 *         description: ingredients service unavailable
 */

/**
 * @openapi
 * /api/v1/pizzas/{id}/ingredients/{ingredientId}:
 *   put:
 *     summary: Update the quantity of an ingredient in a pizza
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: composition updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: pizza not found or ingredient not part of this pizza
 *   delete:
 *     summary: Remove an ingredient from a pizza
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: ingredient removed from the pizza
 *       404:
 *         description: pizza not found or ingredient not part of this pizza
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('description').optional().isString(),
    body('imageUrl').optional().isString().isURL().withMessage('imageUrl must be a valid URL'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

router.get('/', pizzaController.findAll);
router.post('/', createAndUpdateValidations, pizzaController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.findOne);
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], pizzaController.update);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.delete);

// Composition (product_compositions)
const idParam = param('id').isInt().withMessage('id must be an integer');
const ingredientIdParam = param('ingredientId').isInt().withMessage('ingredientId must be an integer');
const quantityRule = (chain) => chain.isInt({ gt: 0 }).withMessage('quantity must be a positive integer');

router.get('/:id/ingredients', [idParam], pizzaController.getIngredients);
router.post('/:id/ingredients', [
    idParam,
    body('ingredientId').isInt().withMessage('ingredientId must be an integer'),
    quantityRule(body('quantity').optional()),
], pizzaController.addIngredient);
router.put('/:id/ingredients/:ingredientId', [idParam, ingredientIdParam, quantityRule(body('quantity'))], pizzaController.updateIngredient);
router.delete('/:id/ingredients/:ingredientId', [idParam, ingredientIdParam], pizzaController.removeIngredient);

module.exports = router;
