const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, 'utf-8');
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
  
      // Validar que todos los campos obligatorios estén presentes
      if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        throw new Error('Faltan campos obligatorios');
      }
  
      // Generar un ID único
      const id = (products[products.length - 1]?.id || 0) + 1;
  
      // Crear el nuevo producto
      const newProduct = {
        id,
        status: true,
        ...product,
      };
  
      // Agregar el producto a la lista y guardar en el archivo
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
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
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter((product) => product.id !== id);
    if (filteredProducts.length === products.length) return null;
    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
    return true;
  }
}

module.exports = ProductManager;