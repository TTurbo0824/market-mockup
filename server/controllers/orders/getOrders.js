const { Order, OrderItem, Item } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { id } = accessTokenData;

    let allOrders = await Order.findAll({
      where: { userId: id }
    });

    if (!allOrders.length) {
      return res.status(404).json({ message: 'no orders found' });
    }

    allOrders = Sequelize.getValues(allOrders);

    const orderIds = [];

    allOrders.forEach((order) => {
      orderIds.push(order.id);
    });

    const tempItemList = {};

    const getOrderItems = async () => {
      await Promise.all(
        orderIds.map(async (el) => {
          let orderItems = await OrderItem.findAll({
            include: [
              {
                model: Item,
                attributes: ['itemName', 'price', 'category', 'img']
              }
            ],
            where: {
              orderId: el
            }
          });

          orderItems = Sequelize.getValues(orderItems);
          orderItems = orderItems.map((item) => {
            return {
              itemId: item.itemId,
              itemName: item.Item.itemName,
              img: item.Item.img,
              quantity: item.quantity,
              price: item.Item.price * item.quantity,
              category: item.Item.category
            };
          });
          tempItemList[el] = orderItems;
        })
      ).then(() => {
        const fullItemList = [];

        allOrders.forEach((order) => {
          fullItemList.push({
            id: order.id,
            uniqueId: order.uniqueId,
            status: order.status,
            totalPrice: order.totalPrice,
            date: order.createdAt.toISOString().slice(0, 10),
            cancelRequestDate: order.cancelRequestDate,
            cancelDate: order.cancelDate,
            items: tempItemList[order.id]
          });
        });
        res.status(200).json({ data: fullItemList.reverse(), message: 'ok' });
      });
    };

    getOrderItems();
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
