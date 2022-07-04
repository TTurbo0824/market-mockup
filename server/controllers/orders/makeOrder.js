const { Order, OrderItem, Cart, Item } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);
    // const accessTokenData = { id: req.headers.authorization };
    console.log(accessTokenData.id);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { newOrders, curDate } = req.body;

    // const newOrders = [
    //   {
    //     id: 14,
    //     img: '퍼즐.jpg',
    //     itemName: '퍼즐 1000피스',
    //     price: 19800,
    //     quantity: 1
    //   },
    //   {
    //     id: 15,
    //     img: '물티슈.jpg',
    //     itemName: '물티슈 70매 X 10입(박스)',
    //     price: 14000,
    //     quantity: 1
    //   }
    // ];

    // const curDate = '2022-07-04';

    let totalPrice = 0;
    newOrders.forEach((el) => totalPrice += el.price);
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
      attributes: ['id']
    });

    itemList = Sequelize.getValues(itemList);
    itemList = itemList.map(el => el.id);

    const newItems = itemList.map((el, idx) => {
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
