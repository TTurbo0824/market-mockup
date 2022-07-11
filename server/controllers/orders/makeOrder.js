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

    const { newOrders } = req.body;

    let totalPrice = 0;

    newOrders.forEach((el) => (totalPrice += el.price));

    const itemNames = newOrders.map((el) => el.itemName);
    const itemQuantity = newOrders.map((el) => el.quantity);
    const idToDelete = newOrders.map((el) => el.id);

    function generateCode (length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    const uniqueId = generateCode(6);

    const payload = {
      userId: accessTokenData.id,
      uniqueId,
      status: '결제완료',
      totalPrice,
      cancelDate: null
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

    res.status(200).json({ data: { id: orderId, uniqueId }, message: 'ok' });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
