// entities/ProductComposition.js
const db = require('../config/database');

/**
 * Link between a pizza (local) and an ingredient (remote, ingredients microservice).
 */
class ProductComposition {
    static findByPizzaId(pizzaId) {
        const sql = `SELECT * FROM product_compositions WHERE pizza_id = ? ORDER BY id`;
        return new Promise((resolve, reject) => {
            db.all(sql, [pizzaId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static find(pizzaId, ingredientId) {
        const sql = `SELECT * FROM product_compositions WHERE pizza_id = ? AND ingredient_id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [pizzaId, ingredientId], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    static create({ pizzaId, ingredientId, quantity }) {
        const sql = `INSERT INTO product_compositions (pizza_id, ingredient_id, quantity, created_at, updated_at)
                 VALUES (?, ?, ?, datetime('now'), datetime('now'))`;
        const params = [pizzaId, ingredientId, quantity || 1];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                ProductComposition.find(pizzaId, ingredientId).then(resolve).catch(reject);
            });
        });
    }

    static update(pizzaId, ingredientId, { quantity }) {
        const sql = `
      UPDATE product_compositions
      SET quantity = ?,
          updated_at = datetime('now')
      WHERE pizza_id = ? AND ingredient_id = ?
    `;
        return new Promise((resolve, reject) => {
            db.run(sql, [quantity, pizzaId, ingredientId], function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                ProductComposition.find(pizzaId, ingredientId).then(resolve).catch(reject);
            });
        });
    }

    static delete(pizzaId, ingredientId) {
        const sql = `DELETE FROM product_compositions WHERE pizza_id = ? AND ingredient_id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [pizzaId, ingredientId], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // number of rows deleted
            });
        });
    }
}

module.exports = ProductComposition;
