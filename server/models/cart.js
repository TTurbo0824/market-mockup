'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Cart.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: 'cartId'
      });
      Cart.belongsTo(models.Item, {
        onDelete: 'CASCADE',
        foreignKey: 'cartId'
      });
    }
  }
  Cart.init({
    cartId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Cart'
  });
  return Cart;
};
