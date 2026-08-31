const express = require("express");
const pizzasRouter = require("./routes/pizzas");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Parsing du JSON envoyé dans le body des requêtes
app.use(express.json());

// Route de bienvenue - permet de vérifier que l'API écoute
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Montage des routes de la ressource "pizzas" sous /api/pizzas
app.use("/api/pizzas", pizzasRouter);

// 404 pour toute route non définie
app.use(notFoundHandler);

// Gestion centralisée des erreurs (500)
app.use(errorHandler);

module.exports = app;
