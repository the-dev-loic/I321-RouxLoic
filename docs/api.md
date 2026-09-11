# Documentation API — Ressource `pizzas`

Base URL : `http://localhost:3000/api`

## Modèle de données exposé

| Champ         | Type      | Description                                              |
|---------------|-----------|------------------------------------------------------------|
| `id`          | integer   | Identifiant technique, généré automatiquement             |
| `name`        | string    | Nom de la pizza (identifiant naturel, unique)              |
| `ingredients` | string    | Ingrédients, concaténés sous forme lisible ("A, B, C")     |
| `imageUrl`    | string    | URL d'une image (peut être vide `""`)                      |
| `price`       | number    | Prix en CHF, strictement positif                            |
| `created_at`  | datetime  | Date de création (`YYYY-MM-DD HH:MM:SS`)                    |
| `updated_at`  | datetime  | Date de dernière modification                                |

## Structure des appels

### `GET /pizzas`

Liste toutes les pizzas de la carte.

| Critères   | Valeur    |
|------------|-----------|
| Verbe HTTP | `GET`     |
| Chemin     | `/pizzas` |
| Paramètres | Aucun     |

**Réponse `200 OK`** — tableau de pizzas.

---

### `GET /pizzas/:id`

Affiche une seule pizza.

| Critères   | Valeur        |
|------------|---------------|
| Verbe HTTP | `GET`         |
| Chemin     | `/pizzas/:id` |
| Paramètres | `id` (path, integer) |

**Réponse `200 OK`** — objet pizza.
**Réponse `404 Not Found`** si l'id n'existe pas :
```json
{ "error": "Pizza not found" }
```

---

### `POST /pizzas`

Ajoute une nouvelle pizza à la carte.

| Critères   | Valeur    |
|------------|-----------|
| Verbe HTTP | `POST`    |
| Chemin     | `/pizzas` |

**Corps de la requête**

```json
{
  "name": "Calzone",
  "ingredients": ["Jambon", "Mozzarella", "Champignons"],
  "imageUrl": "",
  "price": 18
}
```

**Réponse `201 Created`** — la pizza créée.
**Réponse `400 Bad Request`** si les données sont invalides :
```json
{
  "errors": [
    { "type": "field", "msg": "name is required", "path": "name", "location": "body" }
  ]
}
```

---

### `PUT /pizzas/:id`

Met à jour une pizza existante (son prix, ses ingrédients, etc.).

**Corps de la requête** : identique à `POST /pizzas`.

**Réponse `200 OK`** — la pizza mise à jour.
**Réponse `404 Not Found`** si l'id n'existe pas.
**Réponse `400 Bad Request`** si les données sont invalides.

---

### `DELETE /pizzas/:id`

Supprime une pizza de la carte.

**Réponse `204 No Content`** en cas de succès.
**Réponse `404 Not Found`** si l'id n'existe pas.

---

## Exemples `curl`

```bash
# Preuve que l'API écoute
curl localhost:3000

# Lister toutes les pizzas
curl localhost:3000/api/pizzas | jq

# Récupérer une pizza précise
curl localhost:3000/api/pizzas/1 | jq

# Ajouter une pizza
curl -X POST localhost:3000/api/pizzas \
  -H "Content-Type: application/json" \
  -d '{"name":"Calzone","ingredients":["Jambon","Mozzarella","Champignons"],"imageUrl":"","price":18}' | jq

# Mettre à jour une pizza
curl -X PUT localhost:3000/api/pizzas/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Pizza du moment","ingredients":["Nouvelle recette"],"imageUrl":"","price":22}' | jq

# Supprimer une pizza
curl -X DELETE localhost:3000/api/pizzas/1 -i

# Route inexistante -> 404
curl -i localhost:3000/pizzas
```
