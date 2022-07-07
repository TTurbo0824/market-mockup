const { User } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

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
      attributes: ['id', 'username', 'createdAt']
    });

    userList = userList.map((user) => {
      return {
        id: user.id,
        username: user.username,
        userStatus: 'normal',
        signupDate: String(user.createdAt).slice(0, 10),
        dormantDate: null
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
