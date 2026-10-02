// server.js
require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Ingredients service listening on http://localhost:${port}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Swagger UI: http://localhost:${port}/docs`);
    }
});
