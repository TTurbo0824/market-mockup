const { Cart, Item } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { itemId } = req.body;

    const itemInfo = await Item.findOne({ where: { id: itemId } });

    if (itemInfo.status !== '판매중') {
      return res.status(400).json({ message: 'item not available' });
    }

    let newId = await Cart.findAll();
    newId = !newId.length ? 1 : newId[newId.length - 1].id + 1;

    const payload = {
      id: newId,
      userId: accessTokenData.id,
      itemId,
      quantity: 1
    };

    await Cart.create(payload);

    res.status(200).json({ data: { id: newId }, message: 'added to the cart' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
