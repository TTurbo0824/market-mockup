const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

router.get('/items', controllers.items);
router.get('/admin-items', controllers.adminItems);
router.patch('/admin-items', controllers.adminEditItems);
router.get('/admin-users', controllers.adminUsers);
router.get('/admin-transactions', controllers.adminTrans);
router.patch('/admin-order', controllers.cancelOrder);
router.post('/signup', controllers.signup);
router.post('/signin', controllers.signin);
router.post('/refreshToken', controllers.refreshToken);
router.get('/user-info', controllers.getUserInfo);
router.patch('/user-info', controllers.editUserInfo);
router.delete('/withdrawal', controllers.withdrawal);
router.post('/cart', controllers.getCartItems);
router.post('/cart-item', controllers.addToCart);
router.delete('/cart-item', controllers.removeFromCart);
router.patch('/cart-item', controllers.changeQuant);
router.get('/order', controllers.getOrders);
router.post('/order', controllers.makeOrder);
router.patch('/order', controllers.cancelRequest);

module.exports = router;