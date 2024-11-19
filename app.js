const express = require('express');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();
const PORT = 8080;

app.use(express.json()); // Middleware para trabajar con JSON

// Configurar rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});