const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Foodtruck API — Pizzas',
            version: '1.0.0',
            description: "Documentation de la ressource 'pizzas' — Projet Foodtruck (I321)",
        },
        servers: [{ url: '/api' }],
    },
    apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
