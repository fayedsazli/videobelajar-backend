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
    static associate(models) {
      // define association here
    }
  }
  User.init({
    Nama: DataTypes.STRING,
    Email: DataTypes.STRING,
    Password: DataTypes.STRING,
    No_Hp: DataTypes.STRING,
    Role: DataTypes.STRING,
    Created_at: DataTypes.DATE,
    Updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};