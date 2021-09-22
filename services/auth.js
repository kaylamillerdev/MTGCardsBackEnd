var models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secretKey = 'secretKey';

var authService = {
    signUser: function(user) {
        const token = jwt.sign(
            {
                email: user.email,
                UserId: user.id
            },
        secretKey,
            {
                expiresIn: '1h'
            }
        );
        return token;
    },
    verifyUser: function (token, callBackfunction) {
    try {
        return jwt.verify(token, secretKey, callBackfunction);
    } catch (err) {
        console.log(err);
        return null;
    }
},
    hashPassword: function (plainTextPassword) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(plainTextPassword, salt);
        return hash;
    },
    comparePasswords: function (plainTextPassword, hashedPassword) {
        return bcrypt.compareSync(plainTextPassword, hashedPassword);
    }
}

module.exports = authService;