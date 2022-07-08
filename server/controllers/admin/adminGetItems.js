const { Item, User } = require('../../models');
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

    let itemList = await Item.findAll();

    itemList = itemList.map((item) => {
      return {
        id: item.id,
        itemName: item.itemName,
        price: item.price,
        category: item.category,
        img: item.img,
        stock: item.stock,
        status: item.status,
        sold: item.sold
      };
    });

    if (itemList.length !== 0) {
      res.status(200).json({
        data: itemList,
        message: 'ok'
      });
    } else res.status(200).json({ data: [], message: 'no items found' });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
