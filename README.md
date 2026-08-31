# MyAPI — Gestion de la carte des pizzas

API REST permettant au pizzaïolo de gérer la carte des mets (pas de gestion
de commande). Basée sur Express, architecture en couches : `routes` →
`controllers` → `models`.

## Installation

```bash
npm install
```

## Lancement

```bash
npm start      # production
npm run dev    # avec nodemon (rechargement auto)
```

Le serveur écoute par défaut sur le port `3000` (configurable via `.env`).

```bash
curl localhost:3000
# {"message":"Welcome to the API"}
```

## Structure du projet

```
MyAPI/
├── .env                  // variables d'environnement (PORT, ...)
├── .gitignore
├── app.js                // configuration Express + montage des routes
├── server.js             // point d'entrée, démarre le serveur
├── package.json
├── README.md
├── controllers/
│   └── pizzas.js         // logique métier + validation + codes HTTP
├── docs/                 // documentation technique (à compléter, Swagger à venir)
├── middleware/
│   └── errorHandler.js   // 404 + gestion centralisée des erreurs 500
├── models/
│   └── pizza.js          // accès aux données (en mémoire pour l'instant)
└── routes/
    └── pizzas.js         // définition des routes de la ressource /api/pizzas
```

## Modèle de données (MLD simplifié)

**PIZZAS**(<u>id</u>, title, image, ingredients, price)
- `id` : entier, clé primaire
- `title` : texte, unique
- `image` : texte, nullable (URL)
- `ingredients` : liste de textes (pas de table intermédiaire à ce stade)
- `price` : nombre décimal, positif

## Routes disponibles

Toutes les routes sont préfixées par `/api/pizzas`.

| Verbe HTTP | Chemin | Description | Codes retour |
|---|---|---|---|
| GET | `/api/pizzas` | Lister toutes les pizzas | 200 |
| GET | `/api/pizzas/:id` | Afficher une seule pizza | 200, 404 |
| POST | `/api/pizzas` | Ajouter une nouvelle pizza | 201, 400, 409 |
| PUT | `/api/pizzas/:id` | Mettre à jour une pizza (prix, ingrédients, ...) | 200, 400, 404, 409 |
| DELETE | `/api/pizzas/:id` | Supprimer une pizza de la carte | 204, 404 |

### Payload attendu (POST / PUT)

```json
{
  "title": "La Diavola",
  "image": null,
  "ingredients": ["Merguez", "Salami piquant", "Poivrons", "Oignons rouge", "Mozzarella fior di latte"],
  "price": 19
}
```

- `title` : requis (POST), unique
- `price` : requis, nombre > 0
- `ingredients` : requis, tableau non vide de chaînes
- `image` : optionnel, chaîne ou `null`

## Exemples d'appels

```bash
# Lister les pizzas
curl localhost:3000/api/pizzas

# Afficher une pizza
curl localhost:3000/api/pizzas/1

# Créer une pizza
curl -X POST localhost:3000/api/pizzas \
  -H "Content-Type: application/json" \
  -d '{"title":"La Diavola","ingredients":["Merguez","Salami piquant"],"price":19}'

# Mettre à jour le prix d'une pizza
curl -X PUT localhost:3000/api/pizzas/1 \
  -H "Content-Type: application/json" \
  -d '{"price":14}'

# Supprimer une pizza
curl -X DELETE localhost:3000/api/pizzas/2

# Route ou ressource inexistante
curl -i localhost:3000/users
# HTTP/1.1 404 Not Found
```

## Prochaines étapes

- Remplacer le stockage en mémoire (`models/pizza.js`) par Sequelize + MySQL,
  sans impacter `../../OneDrive - Education Vaud/Bureau/MyAPI/controllers` ni `../../OneDrive - Education Vaud/Bureau/MyAPI/routes`.
- Documenter les routes avec Swagger.
- Gérer la fonctionnalité "pizza du moment" (hors périmètre actuel).
