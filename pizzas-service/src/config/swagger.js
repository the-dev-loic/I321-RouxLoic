// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 3000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pizzas API',
            version: '1.0.0',
            description: 'Pizzas microservice (SQLite, Express). Pizza compositions reference the ingredients microservice.'
        },
        servers: [
            { url: `http://localhost:${port}`, description: 'Local dev server' }
        ]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'] // pick up JSDoc in routes/controllers
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
