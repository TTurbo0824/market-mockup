const { Cart } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { itemId } = req.body;

    await Cart.destroy({
      where: {
        id: itemId
      }
    });

    res.status(200).json({ message: 'item removed' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
