const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'foodtruck.sqlite');

// S'assurer que le dossier de destination existe
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON');

    // Une pizza : identifiant naturel "name" (unique), pas de notion de stock
    // contrairement à un "produit" générique.
    db.run(`
        CREATE TABLE IF NOT EXISTS pizzas (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        VARCHAR(100) NOT NULL UNIQUE,
            imageUrl    VARCHAR(255) DEFAULT '',
            price       DECIMAL(10,2) NOT NULL,
            created_at  DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
            updated_at  DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
        );
    `);

    // Un ingrédient : identifiant naturel "name" (unique), peut être partagé
    // par plusieurs pizzas (association N à N -> voir MCD/MLD de l'étape 01).
    db.run(`
        CREATE TABLE IF NOT EXISTS ingredients (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE
        );
    `);

    // Table intermédiaire née de l'association N à N Pizza <-> Ingredient
    db.run(`
        CREATE TABLE IF NOT EXISTS pizzas_ingredients (
            pizza_id      INTEGER NOT NULL,
            ingredient_id INTEGER NOT NULL,
            PRIMARY KEY (pizza_id, ingredient_id),
            FOREIGN KEY (pizza_id) REFERENCES pizzas(id) ON DELETE CASCADE,
            FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
        );
    `);

    // Seed : uniquement si la table est vide
    db.get('SELECT COUNT(*) AS total FROM pizzas', [], (err, row) => {
        if (err) return console.error(err);
        if (row.total > 0) return;

        const now = '2025-09-09 08:26:21';

        const seed = [
            {
                name: 'Pizza du moment',
                imageUrl: 'https://picsum.photos/200?1',
                price: 20,
                ingredients: [
                    'Sauce de tomates jaunes',
                    'Bresaola',
                    'Copeaux de parmesan',
                    'Rucola',
                    'Tomates cerises',
                    'Mozzarella fior di latte',
                ],
            },
            {
                name: 'Margherita',
                imageUrl: '',
                price: 12,
                ingredients: ['Mozzarella'],
            },
            {
                name: '4 Saisons',
                imageUrl: '',
                price: 17,
                ingredients: ['Jambon', 'Champignons frais', 'Poivrons', 'Artichauts', 'Mozzarella'],
            },
        ];

        // Insertion strictement séquentielle (pizza par pizza, ingrédient par
        // ingrédient) afin de garantir l'ordre de la carte et des compositions.
        const insertPizzaSeq = (index) => {
            if (index >= seed.length) return;
            const pizza = seed[index];

            db.run(
                `INSERT INTO pizzas (name, imageUrl, price, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
                [pizza.name, pizza.imageUrl, pizza.price, now, now],
                function (err) {
                    if (err) {
                        console.error(err);
                        return insertPizzaSeq(index + 1);
                    }
                    const pizzaId = this.lastID;

                    const insertIngredientSeq = (i) => {
                        if (i >= pizza.ingredients.length) return insertPizzaSeq(index + 1);
                        const ingredientName = pizza.ingredients[i];

                        db.run('INSERT OR IGNORE INTO ingredients (name) VALUES (?)', [ingredientName], (err) => {
                            if (err) console.error(err);
                            db.run(
                                `INSERT INTO pizzas_ingredients (pizza_id, ingredient_id)
                                 SELECT ?, id FROM ingredients WHERE name = ?`,
                                [pizzaId, ingredientName],
                                (err) => {
                                    if (err) console.error(err);
                                    insertIngredientSeq(i + 1);
                                }
                            );
                        });
                    };

                    insertIngredientSeq(0);
                }
            );
        };

        insertPizzaSeq(0);
    });
});

module.exports = db;
