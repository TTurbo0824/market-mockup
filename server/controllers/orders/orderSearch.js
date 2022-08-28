const { Order, OrderItem, Item } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { id } = accessTokenData;

    const searchWord = req.query.q;

    let allOrders = await Order.findAll({
      where: { userId: id }
    });

    if (!allOrders.length) {
      return res.status(404).json({ message: 'no orders found' });
    }

    allOrders = Sequelize.getValues(allOrders);

    const tempOrderIds = [];

    allOrders.forEach((order) => {
      tempOrderIds.push(order.id);
    });

    const tempItemList = {};

    const getOrderItems = async () => {
      await Promise.all(
        tempOrderIds.map(async (el) => {
          let orderItems = await OrderItem.findAll({
            include: [
              {
                model: Item,
                attributes: ['itemName', 'price', 'category', 'img'],
                where: {
                  itemName: { [Op.like]: `%${searchWord}%` }
                }
              },
              {
                model: Order,
                attributes: ['id', 'uniqueId', 'status']
              }
            ],
            where: {
              orderId: el
            }
          });

          orderItems = Sequelize.getValues(orderItems);

          orderItems = orderItems.map((item) => {
            return {
              orderId: item.Order.id,
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
          if (tempItemList[order.id].length > 0) {
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
          }
        });
        if (fullItemList.length) return res.status(200).json({ data: fullItemList, message: 'ok' });
        else return res.status(404).json({ message: 'no orders found' });
      });
    };

    getOrderItems();
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
