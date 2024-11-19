const fs = require('fs');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    // Crea un nuevo carrito
    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = {
                id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
                products: [],
            };

            carts.push(newCart);
            await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            console.error('Error en createCart:', error.message);
            throw new Error('No se pudo crear el carrito');
        }
    }

    // Obtiene todos los carritos
    async getCarts() {
        try {
            if (!fs.existsSync(this.filePath)) {
                return [];
            }

            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error en getCarts:', error.message);
            return [];
        }
    }

    // Obtiene un carrito por su ID
    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === cartId) || null;
        } catch (error) {
            console.error('Error en getCartById:', error.message);
            throw new Error('No se pudo obtener el carrito');
        }
    }

    // Agrega un producto a un carrito por su ID
    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            if (cartIndex === -1) {
                return null; // Carrito no encontrado
            }

            const cart = carts[cartIndex];
            const productIndex = cart.products.findIndex(p => p.product === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1; // Incrementa la cantidad
            } else {
                cart.products.push({
                    product: productId,
                    quantity: 1
                }); // Agrega un nuevo producto
            }

            carts[cartIndex] = cart;
            await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error('Error en addProductToCart:', error.message);
            throw new Error('No se pudo agregar el producto al carrito');
        }
    }
}

module.exports = CartManager;