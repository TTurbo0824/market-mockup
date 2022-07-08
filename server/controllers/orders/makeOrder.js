const { Order, OrderItem, Cart, Item } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { newOrders, curDate } = req.body;

    let totalPrice = 0;
    newOrders.forEach((el) => (totalPrice += el.price));
    const itemNames = newOrders.map((el) => el.itemName);
    const itemQuantity = newOrders.map((el) => el.quantity);
    const idToDelete = newOrders.map((el) => el.id);

    const payload = {
      userId: accessTokenData.id,
      totalPrice,
      date: curDate
    };

    await Order.create(payload);

    let allOrders = await Order.findAll();
    allOrders = Sequelize.getValues(allOrders);
    const orderId = !allOrders.length ? 1 : allOrders[allOrders.length - 1].id;

    let itemList = await Item.findAll({
      where: {
        itemName: itemNames
      },
      attributes: ['id', 'stock', 'sold']
    });

    itemList = Sequelize.getValues(itemList);

    const itemIdList = itemList.map((el) => el.id);
    const stockList = itemList.map((el) => el.stock);
    const soldList = itemList.map((el) => el.sold);

    newOrders.map(async (el, idx) => {
      await Item.update(
        {
          stock: stockList[idx] - el.quantity,
          sold: soldList[idx] + el.quantity
        },
        {
          where: {
            id: itemIdList[idx]
          }
        }
      );
    });

    const newItems = itemIdList.map((el, idx) => {
      return {
        orderId: orderId,
        itemId: el,
        quantity: itemQuantity[idx]
      };
    });

    await OrderItem.bulkCreate(newItems);

    await Cart.destroy({
      where: {
        id: idToDelete
      }
    });

    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
