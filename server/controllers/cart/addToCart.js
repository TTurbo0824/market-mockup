const { Cart } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    // const accessTokenData = isAuthorized(req);
    const accessTokenData = { id: req.headers.authorization };
    console.log(accessTokenData.id);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { itemId, price } = req.body;

    const payload = {
      userId: accessTokenData.id,
      itemId,
      quantity: 1,
      price
    };

    await Cart.create(payload);
    res.status(200).json({ message: 'added to the cart' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
