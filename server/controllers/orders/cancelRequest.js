const { Order } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { orderId } = req.body;

    let cancelOrder = await Order.findOne({
      where: { id: orderId }
    });

    cancelOrder = Sequelize.getValues(cancelOrder);

    // const today = new Date();

    // if ((today - cancelOrder.createdAt) / 1000 / 24 / 60 / 60 > 7) {
    //   res.status(400).json({ message: 'cancellation date has passed' });
    // }

    await Order.update(
      {
        status: '취소요청'
      },
      {
        where: { id: orderId }
      }
    );

    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
