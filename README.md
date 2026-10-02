# Pizzeria API – microservices

Two independent microservices built with **Express**, **SQLite3**, **express-validator** and documented with **Swagger UI**.
Each service has **its own web server and its own database**, so they can run on different nodes.

| Service               | Default port | Database             | Resources                                      |
|-----------------------|--------------|----------------------|------------------------------------------------|
| `ingredients-service` | 3001         | `ingredients.sqlite` | `ingredients`                                  |
| `pizzas-service`      | 3000         | `pizzas.sqlite`      | `pizzas`, `product_compositions` (composition) |

The pizzas service knows nothing about the ingredients table: `product_compositions.ingredient_id` is a
remote reference, validated and resolved over HTTP against the ingredients service (`INGREDIENTS_API_URL`).

---

## Requirements

- **Node.js**: v18.x or higher (uses the global `fetch`)
- **npm**: v9.x or higher

## Project structure

```bash
├───docs
│       class_diagram.puml
├───ingredients-service
│   │   .env.example
│   │   package.json
│   └───src
│       ├───config        database.js, swagger.js
│       ├───controllers   ingredientsController.js
│       ├───entities      Ingredient.js
│       └───routes        ingredients.js, router.js
└───pizzas-service
    │   .env.example
    │   package.json
    └───src
        ├───config        database.js, swagger.js
        ├───controllers   pizzaController.js
        ├───entities      Pizza.js, ProductComposition.js
        ├───routes        pizzas.js, router.js
        └───services      pizzaService.js, ingredientsClient.js
```

## Installation

From the root (npm workspaces, installs both services):

```bash
npm install
```

Or on a dedicated node, inside a single service folder:

```bash
cd pizzas-service && npm install
```

Copy `.env.example` to `.env` in each service and adapt it.

## Running

```bash
npm run dev:ingredients   # http://localhost:3001  – Swagger: /docs
npm run dev:pizzas        # http://localhost:3000  – Swagger: /docs
```

(`npm start` inside a service folder starts it without nodemon.)

## Environment

`ingredients-service/.env`

```bash
PORT=3001
DB_FILE=./ingredients.sqlite
NODE_ENV=development
```

`pizzas-service/.env`

```bash
PORT=3000
DB_FILE=./pizzas.sqlite
NODE_ENV=development
INGREDIENTS_API_URL=http://localhost:3001/api/v1   # address of the ingredients node
INGREDIENTS_API_TIMEOUT_MS=3000
```

## Endpoints

Ingredients service – `/api/v1/ingredients` : `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`

Pizzas service – `/api/v1/pizzas` : `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`

Pizza composition (pizzas service, calls the ingredients service):

| Method   | Route                                         | Body                              | Notes                                         |
|----------|-----------------------------------------------|-----------------------------------|-----------------------------------------------|
| `GET`    | `/api/v1/pizzas/:id/ingredients`              |                                   | ingredients details fetched remotely          |
| `POST`   | `/api/v1/pizzas/:id/ingredients`              | `{ "ingredientId": 1, "quantity": 2 }` | 422 if the ingredient doesn't exist, 409 if already present |
| `PUT`    | `/api/v1/pizzas/:id/ingredients/:ingredientId`| `{ "quantity": 3 }`               |                                               |
| `DELETE` | `/api/v1/pizzas/:id/ingredients/:ingredientId`|                                   |                                               |

If the ingredients service cannot be reached, composition endpoints answer **503**.
Deleting a pizza deletes its compositions (`ON DELETE CASCADE`).
