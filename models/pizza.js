/**
 * Modèle "Pizza"
 * ---------------------------------------------------------------
 * Champs (cf. MCD/MLD) :
 *   - id           : identifiant unique (clé primaire)
 *   - title        : nom de la pizza (unique)
 *   - image        : URL de l'image (nullable)
 *   - ingredients  : liste des ingrédients (pas encore de table
 *                    intermédiaire à ce stade du projet)
 *   - price        : prix en CHF
 *
 * Pour l'instant, les données sont stockées en mémoire.
 * Cette couche sera la seule à parler avec la base de données
 * plus tard (ex: remplacement par Sequelize + MySQL), sans que
 * les controllers/routes n'aient à changer.
 */

let pizzas = [
  {
    id: 1,
    title: "Margherita",
    image: null,
    ingredients: ["Tomato", "Mozzarella", "Basil"],
    price: 12,
  },
  {
    id: 2,
    title: "4 Saisons",
    image: null,
    ingredients: ["Jambon", "Champignons frais", "Poivrons", "Artichauts", "Mozzarella"],
    price: 17,
  },
];

let nextId = 3;

function findAll() {
  return pizzas;
}

function findById(id) {
  return pizzas.find((p) => p.id === id);
}

function findByTitle(title) {
  return pizzas.find((p) => p.title.toLowerCase() === title.toLowerCase());
}

function create({ title, image, ingredients, price }) {
  const pizza = {
    id: nextId++,
    title,
    image: image ?? null,
    ingredients,
    price,
  };
  pizzas.push(pizza);
  return pizza;
}

function update(id, data) {
  const pizza = findById(id);
  if (!pizza) return null;

  if (data.title !== undefined) pizza.title = data.title;
  if (data.image !== undefined) pizza.image = data.image;
  if (data.ingredients !== undefined) pizza.ingredients = data.ingredients;
  if (data.price !== undefined) pizza.price = data.price;

  return pizza;
}

function remove(id) {
  const index = pizzas.findIndex((p) => p.id === id);
  if (index === -1) return false;

  pizzas.splice(index, 1);
  return true;
}

module.exports = {
  findAll,
  findById,
  findByTitle,
  create,
  update,
  remove,
};
