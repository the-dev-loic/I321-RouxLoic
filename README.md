# Foodtruck API — Ressource Pizzas 🍕

API REST développée dans le cadre du module **I321 — Programmer des systèmes distribués**
(CPNV), projet *Foodtruck*.

Elle expose la gestion de la carte des mets (les pizzas) : le pizzaïolo peut lister,
consulter, ajouter, modifier et supprimer des pizzas. **Il ne s'agit pas d'un système
de commande.**

Cette ressource remplace la ressource générique `products` fournie comme base du projet
(étape 00), en respectant la même architecture en couches.

## Stack technique

- **Node.js** + **Express** — serveur HTTP et routage
- **sqlite3** — base de données embarquée (aucun serveur externe requis)
- **express-validator** — validation des entrées de la couche présentation
- **swagger-jsdoc** + **swagger-ui-express** — documentation interactive de l'API
- Architecture en couches : `routes` (présentation) → `controllers` (métier) → `entities` (données)

## Installation

```bash
npm install
cp .env.example .env
```

## Lancer le serveur

```bash
npm start
# ou en mode développement (redémarrage automatique)
npm run dev
```

Le serveur démarre par défaut sur `http://localhost:3000`.
Une base de données SQLite est créée automatiquement dans `./data/foodtruck.sqlite`,
pré-remplie avec les 3 pizzas de démonstration de l'énoncé.

## Vérifier que ça fonctionne

```bash
# Preuve que l'API écoute
curl localhost:3000

# Lister les pizzas
curl localhost:3000/api/pizzas | jq
```

```json
[
  {
    "id": 3,
    "name": "4 Saisons",
    "ingredients": "Jambon, Champignons frais, Poivrons, Artichauts, Mozzarella",
    "imageUrl": "",
    "price": 17,
    "created_at": "2025-09-09 08:26:21",
    "updated_at": "2025-09-09 08:26:21"
  },
  {
    "id": 2,
    "name": "Margherita",
    "ingredients": "Mozzarella",
    "imageUrl": "",
    "price": 12,
    "created_at": "2025-09-09 08:26:21",
    "updated_at": "2025-09-09 08:26:21"
  },
  {
    "id": 1,
    "name": "Pizza du moment",
    "ingredients": "Sauce de tomates jaunes, Bresaola, Copeaux de parmesan, Rucola, Tomates cerises, Mozzarella fior di latte",
    "imageUrl": "https://picsum.photos/200?1",
    "price": 20,
    "created_at": "2025-09-09 08:26:21",
    "updated_at": "2025-09-09 08:26:21"
  }
]
```

Documentation Swagger interactive : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Structure du projet

```
foodtruck-api/
│   .env.example                   # Variables d'environnement non sensibles (à copier en .env)
│   .gitignore                     # Exclusion node_modules, .env, data/
│   app.js                         # Configuration de l'application Express
│   server.js                      # Point d'entrée : démarre l'écoute du serveur
│   package.json
│   README.md
│
├───config/
│       database.js                # Connexion + schéma + seed SQLite
│       swagger.js                 # Configuration OpenAPI/Swagger
│
├───entities/                      # Couche de données
│       Pizza.js                   # Entité métier + persistance (CRUD)
│
├───controllers/                   # Couche métier
│       pizzaController.js         # Validation + logique + codes HTTP
│
├───routes/                        # Couche de présentation
│       router.js                  # Routage de base
│       pizzas.js                  # Routage + validation + doc Swagger de la ressource
│
├───middleware/
│       errorHandler.js            # 404 + gestion d'erreurs génériques
│
└───docs/                          # Documentation technique
        api.md                     # Détail des endpoints
        ProjectSetup.md            # Mise en place du projet
        modele-de-donnees.md       # MCD / MLD de la ressource pizzas
```

## Modèle de données (MCD/MLD)

Voir [`../../../../IdeaProjects/I321-Roux_Loic/docs/modele-de-donnees.md`](../../../../IdeaProjects/I321-Roux_Loic/docs/modele-de-donnees.md).

En résumé : une **Pizza** est associée en **N à N** à des **Ingredient**s (une pizza
a 0 à plusieurs ingrédients, un ingrédient peut apparaître sur plusieurs pizzas),
via une table intermédiaire `pizzas_ingredients`. L'API expose ces ingrédients sous
forme de texte lisible (`ingredients: "A, B, C"`) pour rester compatible avec le
résultat attendu par l'énoncé, mais accepte un tableau de chaînes en entrée (POST/PUT).

## Documentation de l'API

Voir [`../../../../IdeaProjects/I321-Roux_Loic/docs/api.md`](../../../../IdeaProjects/I321-Roux_Loic/docs/api.md) pour le détail de tous les endpoints, ou
la documentation Swagger générée automatiquement (`/api-docs`).

## Git flow

Ce projet a été développé sur une branche dédiée, créée avec :

```bash
git flow feature start pizzas
```
