'use strict';
const authService = require('../services/auth'); //<--- Add authentication service


module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                set(val) {
                    this.setDataValue('password', authService.hashPassword(val));
                }
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING
    });
    Users.associate = function (models) {
        // associations can be defined here
    };
    return Users;
};