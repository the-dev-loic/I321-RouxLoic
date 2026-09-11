# Modèle de données — Pizzas & Ingrédients

Conception réalisée selon les normes Merise (étape 01 du laboratoire).

## MCD (Modèle Conceptuel de Données)

```
┌────────────────────┐          composer          ┌──────────────────────┐
│       Pizzas        │  0,n ───────────────── 0,n │      Ingredients      │
├────────────────────┤                              ├──────────────────────┤
│ __name__ (id nat.)  │                              │ __name__ (id nat.)    │
│ imageUrl (optionnel)│                              └──────────────────────┘
│ price                │
│ created_at            │
│ updated_at            │
└────────────────────┘
```

- Une **Pizza** peut n'avoir aucun ou plusieurs **Ingredient**s (0,n).
- Un **Ingredient** peut être présent sur aucune, une ou plusieurs **Pizza**s (0,n).
- L'association `composer` est donc N à N.

## MLD (Modèle Logique de Données)

```
pizzas ( id, name, imageUrl, price, created_at, updated_at )
   PK : id
   UNIQUE : name

ingredients ( id, name )
   PK : id
   UNIQUE : name

pizzas_ingredients ( pizza_id, ingredient_id )
   PK : (pizza_id, ingredient_id)
   FK : pizza_id      -> pizzas(id)
   FK : ingredient_id -> ingredients(id)
```

L'association N à N devient une table intermédiaire (`pizzas_ingredients`), portant
les deux clés étrangères. C'est elle qui matérialise la composition de chaque pizza.

## Traduction en base SQLite (`config/database.js`)

```sql
CREATE TABLE pizzas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(100) NOT NULL UNIQUE,
    imageUrl    VARCHAR(255) DEFAULT '',
    price       DECIMAL(10,2) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
    updated_at  DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
);

CREATE TABLE ingredients (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE pizzas_ingredients (
    pizza_id      INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    PRIMARY KEY (pizza_id, ingredient_id),
    FOREIGN KEY (pizza_id) REFERENCES pizzas(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);
```

## Choix d'exposition côté API

Pour rester compatible avec le format de réponse attendu par l'énoncé de l'étape 02
(`"ingredients": "Jambon, champignons frais, ..."`), l'entité `Pizza` effectue une
jointure (`GROUP_CONCAT`) et renvoie les ingrédients sous forme de texte lisible dans
les réponses `GET`.

En **entrée** (`POST` / `PUT`), l'API accepte en revanche un tableau de chaînes
(`ingredients: ["Jambon", "Mozzarella"]`), ce qui est plus conforme au sens métier du
modèle N à N : chaque ingrédient reste une entité à part entière, réutilisable d'une
pizza à l'autre.
