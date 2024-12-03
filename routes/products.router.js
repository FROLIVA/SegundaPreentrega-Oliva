const { Router } = require('express');
const ProductManager = require('../src/managers/ProductManager'); 

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const { limit } = req.query; // Captura el límite (opcional) desde la URL
        const products = await productManager.getProducts();

        if (limit) {
            return res.json(products.slice(0, parseInt(limit)));
        }
        res.json(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params; // Captura el id desde la URL
        const product = await productManager.getProductById(parseInt(pid));

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error.message);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const product = req.body;

        // Intenta agregar el producto
        const newProduct = await productManager.addProduct(product);

        // Respuesta exitosa
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear el producto:', error.message);

        // Respuesta con el mensaje de error específico
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params; // Captura el id desde la URL
        const updates = req.body; // Captura los campos a actualizar desde el cuerpo
        const updatedProduct = await productManager.updateProduct(parseInt(pid), updates);

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params; // Captura el id desde la URL
        const success = await productManager.deleteProduct(parseInt(pid));

        if (!success) {
            return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
