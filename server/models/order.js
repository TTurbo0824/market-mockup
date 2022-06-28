'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: 'orderId'
      });
      Order.belongsTo(models.Item, {
        onDelete: 'CASCADE',
        foreignKey: 'orderId'
      });
    }
  }
  Order.init({
    orderId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};