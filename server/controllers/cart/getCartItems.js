const { Cart, Item } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    let cartItems = await Cart.findAll({
      include: [
        {
          model: Item,
          attributes: ['itemName', 'price', 'category', 'img', 'stock', 'status']
        }
      ],
      where: {
        userId: accessTokenData.id
      }
    });

    cartItems = Sequelize.getValues(cartItems);

    const cartQuant = cartItems.map((el) => {
      return {
        itemId: el.id,
        quantity: el.quantity
      };
    });

    cartItems = cartItems.map((el) => {
      return {
        id: el.id,
        itemName: el.Item.itemName,
        img: el.Item.img,
        price: el.Item.price,
        category: el.Item.category,
        stock: el.Item.stock,
        status: el.Item.status
      };
    });

    res.status(200).json({ message: 'ok', cartItems: cartItems, cartQuant: cartQuant });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
