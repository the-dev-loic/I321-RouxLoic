// routes/ingredients.js
const express = require('express');
const { body, param } = require('express-validator');
const ingredientsController = require('../controllers/ingredientsController');

const router = express.Router();

/**
 * @openapi
 * /api/v1/ingredients:
 *   get:
 *     summary: Retrieve a list of ingredients
 *     responses:
 *       200:
 *         description: A list of ingredients
 *   post:
 *     summary: Create a new ingredients
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
 *         description: ingredients created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/v1/ingredients/{id}:
 *   get:
 *     summary: Get a ingredients by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single ingredients
 *       404:
 *         description: ingredients not found
 *   put:
 *     summary: Update a ingredients by ID
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
 *         description: ingredients updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: ingredients not found
 *   delete:
 *     summary: Delete a ingredients by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: ingredients deleted
 *       404:
 *         description: ingredients not found
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

router.get('/', ingredientsController.findAll);
router.post('/', createAndUpdateValidations, ingredientsController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientsController.findOne);
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], ingredientsController.update);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientsController.delete);

module.exports = router;
