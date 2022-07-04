require('dotenv').config();
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const controllers = require('./controllers');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('hello');
});
app.get('/items', controllers.items);
app.post('/signup', controllers.signup);
app.post('/signin', controllers.signin);
app.get('/user-info', controllers.getUserInfo);
app.post('/cart', controllers.getCartItems);
app.post('/cart-item', controllers.addToCart);
app.delete('/cart-item', controllers.removeFromCart);
app.patch('/cart-item', controllers.changeQuant);
app.get('/order', controllers.getOrders);
app.post('/order', controllers.makeOrder);

const HTTPS_PORT = process.env.HTTPS_PORT || 80;

let server;

if (fs.existsSync('./key.pem') && fs.existsSync('./cert.pem')) {
  const privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
  const certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(HTTPS_PORT, () => console.log('https server running'));
} else {
  server = app.listen(HTTPS_PORT, () => console.log('http server running'));
}

module.exports = server;
