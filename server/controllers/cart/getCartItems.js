const { Cart, Item } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    // const accessTokenData = isAuthorized(req);
    const accessTokenData = { id: req.headers.authorization };
    console.log(accessTokenData.id);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    // {"newItems" : [{ "itemId": 2, "quantity": 1 }]}
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
            attributes: ['itemName', 'price']
          }
        ],
        where: {
          userId: accessTokenData.id
        }
      });

      cartItems = Sequelize.getValues(cartItems);

      cartItems = cartItems.map((el) => {
        return {
          id: el.id,
          itemName: el.Item.itemName,
          quantity: el.quantity,
          price: el.Item.price * el.quantity
        };
      });
      res.status(200).json({ message: 'ok', data: cartItems });
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
