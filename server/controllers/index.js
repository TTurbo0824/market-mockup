module.exports = {
  items: require('./items/getItems'),
  signup: require('./users/signup'),
  signin: require('./users/signin'),
  getCartItems: require('./cart/getCartItems'),
  addToCart: require('./cart/addToCart'),
  removeFromCart: require('./cart/removeFromCart'),
  changeQuant: require('./cart/changeQuant')

};
