// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 3001;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ingredients API',
            version: '1.0.0',
            description: 'Ingredients microservice (SQLite, Express).'
        },
        servers: [
            { url: `http://localhost:${port}`, description: 'Local dev server' }
        ]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'] // pick up JSDoc in routes/controllers
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
