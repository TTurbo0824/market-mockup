const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

router.get('/items', controllers.items);
router.get('/admin-items', controllers.adminItems);
router.get('/admin-users', controllers.adminUsers);
router.get('/admin-transactions', controllers.adminTrans);
router.post('/signup', controllers.signup);
router.post('/signin', controllers.signin);
router.post('/refreshToken', controllers.refreshToken);
router.get('/user-info', controllers.getUserInfo);
router.post('/cart', controllers.getCartItems);
router.post('/cart-item', controllers.addToCart);
router.delete('/cart-item', controllers.removeFromCart);
router.patch('/cart-item', controllers.changeQuant);
router.get('/order', controllers.getOrders);
router.post('/order', controllers.makeOrder);

module.exports = router;
