import { sign, verify } from 'jsonwebtoken';
import user from '../models/user';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";

var authService = {
    signUser: function(user) {
        const token = sign(
            {
                Username: user.Username,
                UserId: user.UserId,
                Admin: user.Admin
            },
            'secretkey',
            {
                expiresIn: '1h'
            }
        );
        return token;
    },

    verifyUser: function (token) {  //<--- receive JWT token as parameter
        try {
            let decoded = verify(token, 'secretkey'); //<--- Decrypt token using same key used to encrypt
            return user.findByPk(decoded.UserId); //<--- Return result of database query as promise
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    hashPassword: function(plainTextPassword) {
        let salt = genSaltSync(10);
        let hash = hashSync(plainTextPassword, salt);
        return hash;
    },
    comparePasswords: function (plainTextPassword, hashedPassword) {
        return compareSync(plainTextPassword, hashedPassword)
    }
}

export default authService;