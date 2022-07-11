module.exports = {
  items: require('./items/getItems'),
  adminItems: require('./admin/adminGetItems'),
  adminUsers: require('./admin/adminGetUsers'),
  adminTrans: require('./admin/adminGetTrans'),
  cancelOrder: require('./admin/cancelOrder'),
  signup: require('./users/signup'),
  signin: require('./users/signin'),
  refreshToken: require('./users/refreshTokenRequest'),
  getUserInfo: require('./users/getUserInfo'),
  getCartItems: require('./cart/getCartItems'),
  addToCart: require('./cart/addToCart'),
  removeFromCart: require('./cart/removeFromCart'),
  changeQuant: require('./cart/changeQuant'),
  getOrders: require('./orders/getOrders'),
  makeOrder: require('./orders/makeOrder'),
  cancelRequest: require('./orders/cancelRequest')
};
