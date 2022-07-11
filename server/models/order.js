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
    static associate (models) {
      // define association here
      Order.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: 'userId'
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId'
      });
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    uniqueId: DataTypes.STRING,
    status: DataTypes.STRING,
    totalPrice: DataTypes.INTEGER,
    cancelDate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order'
  });
  return Order;
};
