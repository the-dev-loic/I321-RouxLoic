const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(` Foodtruck API démarrée sur http://localhost:${PORT}`);
    console.log(`   -> curl localhost:${PORT}/api/pizzas | jq`);
    console.log(`   -> Documentation Swagger : http://localhost:${PORT}/api-docs`);
});
