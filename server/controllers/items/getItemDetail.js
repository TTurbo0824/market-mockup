const { Item } = require('../../models');

module.exports = async (req, res) => {
  try {
    const { itemId } = req.query;

    let targetItem = await Item.findOne({
      where: {
        id: Number(itemId)
      }
    });

    if (!targetItem) res.status(404).json({ message: 'item not found' });
    else {
      targetItem = targetItem.dataValues;

      delete targetItem.createdAt;
      delete targetItem.updatedAt;

      res.status(200).json({
        data: targetItem,
        message: 'ok'
      });
    }
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
