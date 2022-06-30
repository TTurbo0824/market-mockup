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

    const { newItems } = req.body;

    const upsert = async (values, condition) => {
      const obj = await Cart.findOne({
        where: condition
      });
      if (obj) {
        values.quantity += obj.quantity;
        return obj.update(values);
      }
      return Cart.create(values);
    };

    const getCartItems = async () => {
      let cartItems = await Cart.findAll({
        include: [
          {
            model: Item,
            attributes: ['itemName', 'price', 'category', 'img']
          }
        ],
        where: {
          userId: accessTokenData.id
        }
      });

      cartItems = Sequelize.getValues(cartItems);

      let cartQuant =[...cartItems];

      cartQuant = cartQuant.map((el) => {
        return {
          itemId: el.id,
          quantity: el.quantity
        }
      })
      cartItems = cartItems.map((el) => {
        return {
          id: el.id,
          itemName: el.Item.itemName,
          img: el.Item.img,
          price: el.Item.price * el.quantity,
          category: el.Item.category
        };
      });
      res.status(200).json({ message: 'ok', cartItems: cartItems, cartQuant: cartQuant });
    };

    const combineItems = async () => {
      await Promise.all(
        newItems.map(async (el) => {
          await upsert(
            {
              userId: accessTokenData.id,
              itemId: el.itemId,
              quantity: el.quantity
            },
            {
              itemId: el.itemId,
              userId: accessTokenData.id
            }
          );
        })
      ).then(() => {
        getCartItems();
      });
    };

    if (!newItems.length) getCartItems();
    else combineItems();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
