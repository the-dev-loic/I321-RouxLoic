const db = require('../../../../../IdeaProjects/I321-Roux_Loic/foodtruck-api/config/database');

/**
 * Entité "Pizza".
 *
 * Sens métier : contrairement à un "produit" générique qui gèrerait un stock
 * et une référence fournisseur, une pizza est un plat préparé à la commande.
 * Sa composition (ingrédients) a un sens culinaire et vient du MCD/MLD de
 * l'étape 01 : une association N à N entre Pizza et Ingredient.
 *
 * Attributs :
 *  - id          : identifiant technique
 *  - name        : identifiant naturel, nom commercial de la pizza (unique)
 *  - ingredients : liste des ingrédients qui la composent (via table intermédiaire)
 *  - imageUrl    : URL d'une photo (peut être vide, seule "la pizza du moment" en a une)
 *  - price       : prix de vente, toujours strictement positif
 *  - created_at / updated_at : traçabilité de la fiche
 */
class Pizza {
    /**
     * Formate une ligne "pizzas" + ses ingrédients (résultat de GROUP_CONCAT)
     * dans le format de sortie attendu par l'API.
     */
    static #mapRow(row) {
        return {
            id: row.id,
            name: row.name,
            ingredients: row.ingredients || '',
            imageUrl: row.imageUrl || '',
            price: row.price,
            created_at: row.created_at,
            updated_at: row.updated_at,
        };
    }

    /**
     * Associe (en les créant si besoin) une liste de noms d'ingrédients à une pizza.
     * Remplace entièrement la composition existante (utile pour le PUT).
     * Insertion strictement séquentielle pour éviter les soucis de timing de
     * sqlite3 avec des statements imbriqués/concurrents.
     */
    static #syncIngredients(pizzaId, ingredientNames) {
        const names = (ingredientNames || []).map((n) => n.trim()).filter(Boolean);

        return new Promise((resolve, reject) => {
            db.run('DELETE FROM pizzas_ingredients WHERE pizza_id = ?', [pizzaId], (err) => {
                if (err) return reject(err);

                const insertNext = (i) => {
                    if (i >= names.length) return resolve();
                    const name = names[i];

                    db.run('INSERT OR IGNORE INTO ingredients (name) VALUES (?)', [name], (err) => {
                        if (err) return reject(err);

                        db.run(
                            `INSERT INTO pizzas_ingredients (pizza_id, ingredient_id)
                             SELECT ?, id FROM ingredients WHERE name = ?`,
                            [pizzaId, name],
                            (err) => {
                                if (err) return reject(err);
                                insertNext(i + 1);
                            }
                        );
                    });
                };

                insertNext(0);
            });
        });
    }

    static create({ name, ingredients, imageUrl, price }) {
        const sql = `
            INSERT INTO pizzas (name, imageUrl, price, created_at, updated_at)
            VALUES (?, ?, ?, datetime('now'), datetime('now'))
        `;
        const params = [name, imageUrl || '', price];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                const pizzaId = this.lastID;
                Pizza.#syncIngredients(pizzaId, ingredients)
                    .then(() => Pizza.findById(pizzaId))
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    // Méthode appelée par le contrôleur dans le cas d'un GET (all)
    static findAll() {
        const sql = `
            SELECT p.id, p.name, p.imageUrl, p.price, p.created_at, p.updated_at,
                   (
                       SELECT GROUP_CONCAT(i.name, ', ')
                       FROM (
                           SELECT ing.name AS name
                           FROM pizzas_ingredients pi
                           JOIN ingredients ing ON ing.id = pi.ingredient_id
                           WHERE pi.pizza_id = p.id
                           ORDER BY ing.id ASC
                       ) i
                   ) AS ingredients
            FROM pizzas p
            ORDER BY p.id DESC
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(Pizza.#mapRow));
            });
        });
    }

    // Méthode appelée par le contrôleur dans le cas d'un GET by id
    static findById(id) {
        const sql = `
            SELECT p.id, p.name, p.imageUrl, p.price, p.created_at, p.updated_at,
                   (
                       SELECT GROUP_CONCAT(i.name, ', ')
                       FROM (
                           SELECT ing.name AS name
                           FROM pizzas_ingredients pi
                           JOIN ingredients ing ON ing.id = pi.ingredient_id
                           WHERE pi.pizza_id = p.id
                           ORDER BY ing.id ASC
                       ) i
                   ) AS ingredients
            FROM pizzas p
            WHERE p.id = ?
        `;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row ? Pizza.#mapRow(row) : null);
            });
        });
    }

    // Méthode appelée par le contrôleur dans le cas d'un PUT
    static update(id, { name, ingredients, imageUrl, price }) {
        const sql = `
            UPDATE pizzas
            SET name = COALESCE(?, name),
                imageUrl = COALESCE(?, imageUrl),
                price = COALESCE(?, price),
                updated_at = datetime('now')
            WHERE id = ?
        `;
        const params = [name, imageUrl, price, id];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);

                const syncPromise =
                    ingredients !== undefined ? Pizza.#syncIngredients(id, ingredients) : Promise.resolve();

                syncPromise
                    .then(() => Pizza.findById(id))
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    // Méthode appelée par le contrôleur dans le cas d'un DELETE by id
    static delete(id) {
        const sql = `DELETE FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // nombre de lignes supprimées
            });
        });
    }
}

module.exports = Pizza;
