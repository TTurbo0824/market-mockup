module.exports = {
  items: require('./items/getItems'),
  signup: require('./users/signup'),
  signin: require('./users/signin'),
  getUserInfo: require('./users/getUserInfo'),
  getCartItems: require('./cart/getCartItems'),
  addToCart: require('./cart/addToCart'),
  removeFromCart: require('./cart/removeFromCart'),
  changeQuant: require('./cart/changeQuant')

};
