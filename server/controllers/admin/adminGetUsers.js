const { User, Order } = require('../../models');
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

    let userList = await User.findAll({
      where: { isAdmin: 0 },
      include: [
        {
          model: Order,
          attributes: ['totalPrice']
        }
      ],
      attributes: ['id', 'username', 'name', 'status', 'createdAt']
    });

    const getTotalPrice = (prices) => {
      let totalPrice = 0;
      prices.forEach((price) => (totalPrice += price.totalPrice));
      return totalPrice;
    };

    userList = userList.map((user) => {
      return {
        id: user.id,
        username: user.username,
        name: user.name,
        userStatus: user.status === 'normal' ? '정상' : '휴면',
        signupDate: user.createdAt,
        dormantDate: user.dormantDate,
        orderTotal: getTotalPrice(user.Orders)
      };
    });

    if (userList.length !== 0) {
      res.status(200).json({
        data: userList,
        message: 'ok'
      });
    } else res.status(404).json({ message: 'no items found' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
