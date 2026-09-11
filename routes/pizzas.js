const express = require('express');
const { body, param } = require('express-validator');
const pizzaController = require('../../../../../IdeaProjects/I321-Roux_Loic/foodtruck-api/controllers/pizzaController');

const router = express.Router();

// Documentation pour le SWAGGER

/**
 * @openapi
 * /api/pizzas:
 *   get:
 *     summary: Retrieve the list of pizzas on the menu
 *     responses:
 *       200:
 *         description: A list of pizzas
 *   post:
 *     summary: Add a new pizza to the menu
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
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pizza created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/pizzas/{id}:
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
 *         description: Pizza not found
 *   put:
 *     summary: Update a pizza by ID (price, ingredients, ...)
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
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pizza updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Pizza not found
 *   delete:
 *     summary: Remove a pizza from the menu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pizza deleted
 *       404:
 *         description: Pizza not found
 */

/**
 * Règles de validation
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('ingredients').optional().isArray().withMessage('ingredients must be an array of strings'),
    body('ingredients.*').optional().isString(),
    body('imageUrl').optional({ checkFalsy: true }).isString().isURL().withMessage('imageUrl must be a valid URL'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

// Après la validation, la redirection vers le contrôleur dédié
router.get('/', pizzaController.findAll);
router.post('/', createAndUpdateValidations, pizzaController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.findOne);
router.put(
    '/:id',
    [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations],
    pizzaController.update
);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.delete);

module.exports = router;
