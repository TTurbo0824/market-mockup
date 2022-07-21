const { Item } = require('../../models');

module.exports = async (req, res) => {
  try {
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
    } else res.status(404).json({ message: 'no items found' });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
