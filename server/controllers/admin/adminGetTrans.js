const { Order, User } = require('../../models');
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

    let allOrders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'name']
        }
      ]
    });

    allOrders = Sequelize.getValues(allOrders);

    allOrders = allOrders.map((order) => {
      return {
        id: order.id,
        uniqueId: order.uniqueId,
        username: order.User.username,
        name: order.User.name,
        status: order.status,
        // paymentDate: order.createdAt.toISOString().slice(0, 10),
        paymentDate: order.createdAt,
        paymentAmount: order.totalPrice,
        canceledAmount: order.cancelDate ? order.totalPrice : null,
        cancelDate: order.cancelDate,
        cancelRequestDate: order.cancelRequestDate
      };
    });

    res.status(200).json({ data: allOrders, message: 'ok' });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
