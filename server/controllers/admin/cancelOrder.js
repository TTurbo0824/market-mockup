const { Order, OrderItem, Item, User } = require('../../models');
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

    const { orderId } = req.body;

    let cancelOrder = await Order.findOne({
      include: [
        {
          model: OrderItem,
          attributes: ['itemId', 'quantity']
        }
      ],
      where: { id: orderId }
    });

    cancelOrder = Sequelize.getValues(cancelOrder);

    const today = new Date();

    await Order.update(
      {
        status: '결제취소',
        cancelDate: today.toISOString().slice(0, 10)
      },
      {
        where: { id: orderId }
      }
    );

    const itemIds = cancelOrder.OrderItems.map((el) => el.itemId);

    let itemList = await Item.findAll({
      where: {
        id: itemIds
      },
      attributes: ['id', 'stock', 'sold']
    });

    itemList = Sequelize.getValues(itemList);

    const itemIdList = itemList.map((el) => el.id);
    const stockList = itemList.map((el) => el.stock);
    const soldList = itemList.map((el) => el.sold);

    cancelOrder.OrderItems.map(async (el, idx) => {
      await Item.update(
        {
          stock: stockList[idx] + el.quantity,
          sold: soldList[idx] - el.quantity
        },
        {
          where: {
            id: itemIdList[idx]
          }
        }
      );
    });

    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
