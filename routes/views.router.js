const express = require('express');
const router = express.Router();
const ProductManager = require('../src/managers/ProductManager');
const productManager = new ProductManager('./src/data/products.json');

// Ruta para Home
router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
        res.status(500).send('Error al cargar la vista');
    }
});

// Ruta para Real-Time Products
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener los productos en tiempo real:', error.message);
        res.status(500).send('Error al cargar la vista');
    }
});

module.exports = router;
