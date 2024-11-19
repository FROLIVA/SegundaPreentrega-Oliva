const express = require('express');
const CartManager = require('../managers/CartManager');
const router = express.Router();

const cartManager = new CartManager('./src/data/carts.json'); // Asegúrate de que la ruta es correcta

// POST /api/carts: Crea un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error.message);
        res.status(500).json({
            error: 'Error al crear el carrito'
        });
    }
});

// GET /api/carts/:cid: Obtiene un carrito por su ID
router.get('/:cid', async (req, res) => {
    try {
        const {
            cid
        } = req.params;
        const cart = await cartManager.getCartById(parseInt(cid));

        if (!cart) {
            return res.status(404).json({
                error: 'Carrito no encontrado'
            });
        }

        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error.message);
        res.status(500).json({
            error: 'Error al obtener el carrito'
        });
    }
});

// POST /api/carts/:cid/product/:pid: Agrega un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const {
            cid,
            pid
        } = req.params;
        const updatedCart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));

        if (!updatedCart) {
            return res.status(404).json({
                error: 'Carrito o producto no encontrado'
            });
        }

        res.json(updatedCart);
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error.message);
        res.status(500).json({
            error: 'Error al agregar el producto al carrito'
        });
    }
});

module.exports = router;