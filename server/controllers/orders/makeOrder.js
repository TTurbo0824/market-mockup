const { Order, OrderItem, Cart, Item } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { newOrders } = req.body;

    const itemNames = newOrders.map((el) => el.itemName);

    let itemList = await Item.findAll({
      where: {
        itemName: itemNames
      },
      attributes: ['id', 'itemName', 'stock', 'sold', 'status']
    });

    itemList = Sequelize.getValues(itemList);

    itemList.sort((a, b) => itemNames.indexOf(a.itemName) - itemNames.indexOf(b.itemName));

    // 모든 상품이 품절
    const isAllOut = newOrders.every(
      (_, idx) => itemList[idx].stock === 0 || itemList[idx].status === '품절'
    );

    if (isAllOut) return res.status(400).json({ message: 'all items are soldout' });

    let totalPrice = 0;

    const lowStockItem = [];
    const idToDelete = [];

    // 모든 상품 품절 => 아예 주문 불가
    // 일부 상품 품절 => 품절 상품 제외 주문

    newOrders.forEach((el, idx) => {
      // 재고 부족 상품은 lowStockItem 배열에 추가
      // 만약 품절된 상품을 포함하지 않은 항목이라면 제거
      if (itemList[idx].stock - el.quantity < 0 || itemList[idx].status === '품절') {
        lowStockItem.push(itemList[idx].itemName);
      } else idToDelete.push(el.id);

      if (itemList[idx].stock === 0 || itemList[idx].status === '품절') {
        // 품절이라면 금액 추가 X
        totalPrice += 0;
      } else if (itemList[idx].stock - el.quantity < 0) {
        // 만약 일부 수량만 구매 가능하다면 해당 수량만 금액 추가
        totalPrice += (el.price / el.quantity) * itemList[idx].stock;
      } else if (itemList[idx].stock >= el.quantity) {
        totalPrice += el.price; // 모두 다 구매 가능하다면 전부 추가
      }
    });

    function generateCode(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    const uniqueId = generateCode(6);

    let allOrders = await Order.findAll();
    allOrders = Sequelize.getValues(allOrders);
    const orderId = !allOrders.length ? 1 : allOrders[allOrders.length - 1].id + 1;

    const payload = {
      id: orderId,
      userId: accessTokenData.id,
      uniqueId,
      status: '결제완료',
      totalPrice,
      cancelDate: null
    };

    await Order.create(payload);

    const newOrderItems = [];

    const updateCartItems = async () => {
      await Promise.all(
        newOrders.map(async (el, idx) => {
          let itemQuant;

          // 재고부족이 아닐 때
          if (itemList[idx].stock - el.quantity >= 0 && itemList[idx].status !== '품절') {
            itemQuant = el.quantity;
            await Cart.destroy({
              where: {
                id: el.id
              }
            });
          } else if (itemList[idx].status === '품절' || itemList[idx].stock === 0) {
            // 이미 품절일 때
            itemQuant = 0;
          } else {
            // 재고부족일 때 = 일부 구매만 가능
            itemQuant = el.stock;
            await Cart.update(
              { quantity: el.quantity - el.stock },
              {
                where: { id: el.id }
              }
            );
          }

          // 결제한 내역이 있는 상품이라면 orderItems에 항목 추가
          if (itemQuant !== 0) {
            newOrderItems.push({ orderId, itemId: itemList[idx].id, quantity: itemQuant });
          }

          await Item.update(
            {
              stock: itemList[idx].stock - itemQuant,
              sold: itemList[idx].sold + itemQuant,
              status:
                itemList[idx].stock - itemQuant === 0 || itemList[idx].status === '품절'
                  ? '품절'
                  : '판매중'
            },
            {
              where: {
                id: itemList[idx].id
              }
            }
          );
        })
      ).then(async () => {
        await OrderItem.bulkCreate(newOrderItems);
        res.status(200).json({ data: { id: orderId, uniqueId, lowStockItem }, message: 'ok' });
      });
    };

    updateCartItems();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
