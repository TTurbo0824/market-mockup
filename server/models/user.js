'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.hasMany(models.Cart, {
        foreignKey: 'userId'
      });
      User.hasMany(models.Order, {
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.TEXT,
    isAdmin: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    dormantDate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User'
  });
  return User;
};
