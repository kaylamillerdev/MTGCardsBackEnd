const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secretKey = 'secretKey';

let authService = {
    signUser: function(user) {
        let token = jwt.sign(
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
    verifyUser: function (token, callBackFunction) {
    try {
        return jwt.verify(token, secretKey, callBackFunction);
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