const express = require('express');
const http = require('http');
const {
    Server
} = require('socket.io');
const path = require('path');
const ProductManager = require('./src/managers/ProductManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager('./src/data/products.json');

app.engine('handlebars', require('express-handlebars')());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

const viewsRouter = require('./routes/views.router');
app.use('/views', viewsRouter);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    const products = await productManager.getProducts();
    socket.emit('initialProducts', products);

    socket.on('newProduct', async (data) => {
        try {
            const product = await productManager.addProduct(data);
            io.emit('productAdded', product);
        } catch (error) {
            console.error('Error en newProduct:', error.message);
            socket.emit('error', {
                message: error.message
            });
        }
    });

    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(parseInt(id));
        io.emit('productDeleted', id);
    });
});

const PORT = 8080;
server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));