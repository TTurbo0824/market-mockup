const { Item } = require('../../models');

module.exports = async (req, res) => {
  try {
    const { itemId } = req.query;

    let stockQuant = await Item.findOne({
      where: {
        id: itemId
      }
    });

    stockQuant = stockQuant.stock;
    res.status(200).json({ data: { quantity: stockQuant }, message: 'ok' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
