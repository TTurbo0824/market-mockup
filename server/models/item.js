'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Item.hasMany(models.Cart, {
        foreignKey: 'itemId'
      });
    }
  }
  Item.init({
    itemName: DataTypes.STRING,
    price: DataTypes.INTEGER,
    category: DataTypes.STRING,
    img: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    status: DataTypes.STRING,
    total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Item'
  });
  return Item;
};
