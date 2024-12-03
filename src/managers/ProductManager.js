const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
  }

  async getProducts() {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer productos:', error);
      throw new Error('Error al leer productos');
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();

      // Validar campos obligatorios
      const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
      const missingFields = requiredFields.filter((field) => !product[field]);
      if (missingFields.length > 0) {
        throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
      }

      const id = (products[products.length - 1]?.id || 0) + 1;

      const newProduct = {
        id,
        status: true,
        ...product,
      };

      products.push(newProduct);
      await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      console.error('Error en addProduct:', error.message);
      throw new Error('Error al agregar el producto');
    }
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, id: products[index].id };
    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter((product) => product.id !== id);
    if (filteredProducts.length === products.length) return null;
    await fs.promises.writeFile(this.filePath, JSON.stringify(filteredProducts, null, 2));
    return true;
  }
}

module.exports = ProductManager;
