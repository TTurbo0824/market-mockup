const { User, Order, OrderItem, Item } = require('../../models');
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

    const isAdmin = await User.findOne({ where: { id } });

    if (!isAdmin.isAdmin) {
      return res.status(401).json({ message: "You don't have permission to access" });
    }

    const { order } = req.params;

    const orderId = Number(order.split('=')[1]);

    let orderItems = await OrderItem.findAll({
      include: [
        {
          model: Item,
          attributes: ['itemName', 'price', 'category', 'img']
        }
      ],

      where: { orderId }
    });

    orderItems = Sequelize.getValues(orderItems);

    if (!orderItems.length) {
      return res.status(404).json({ message: 'orders not found' });
    }

    const itemList = orderItems.map((item) => {
      return {
        itemId: item.itemId,
        itemName: item.Item.itemName,
        img: item.Item.img,
        quantity: item.quantity,
        price: item.Item.price * item.quantity,
        category: item.Item.category
      };
    });

    let orderInfo = await Order.findOne({
      include: [
        {
          model: User,
          attributes: ['name', 'username']
        }
      ],
      where: { id: orderId }
    });

    orderInfo = Sequelize.getValues(orderInfo);

    const userInfo = { name: orderInfo.User.name, username: orderInfo.User.username };

    const payload = {
      id: orderId,
      uniqueId: orderInfo.uniqueId,
      userId: orderInfo.userId,
      date: orderInfo.createdAt.toISOString().slice(0, 10),
      status: orderInfo.status,
      totalPrice: orderInfo.totalPrice,
      items: itemList,
      cancelRequestDate: orderInfo.cancelRequestDate,
      cancelDate: orderInfo.cancelDate
    };

    res.status(200).json({ data: { orderInfo: payload, userInfo }, message: 'ok' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
