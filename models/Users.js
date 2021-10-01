'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    UserId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    Username: DataTypes.STRING,
    Password: DataTypes.STRING,
    Email: DataTypes.STRING,
    Admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};