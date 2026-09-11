require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const router = require('./routes/router');
const swaggerSpec = require('./foodtruck-api/config/swagger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Documentation interactive Swagger, disponible sur /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Toutes les ressources de l'API sont préfixées par /api
app.use('/api', router);

// Preuve que l'API écoute (critère fonctionnel de l'étape 00)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the API' });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
