const { Cart } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { type, itemId } = req.body;

    let curQuant = await Cart.findOne({
      where: {
        id: itemId
      }
    });

    curQuant = curQuant.quantity;

    await Cart.update(
      {
        quantity: type === 'plus' ? curQuant + 1 : curQuant - 1
      },
      { where: { id: itemId } }
    );

    res.status(200).json({ message: 'quantity changed' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
