var express = require('express');
var router = express.Router();

const Users = require('../models').Users;
const authService = require('../services/auth');

const defaultErr = (err, res) => {
  res.status(500);
  res.send(err.toString());
};

router.route('/users/signup')
    .post((req, res, next) => {
      Users
          .create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: (req.body.password)
          })
          .then((newUser) => {
            newUser = newUser.dataValues;
            newUser = { ...newUser, token: authService.signUser(newUser)};
            console.log(newUser);
            res.json(newUser);
          }).catch(e => defaultErr(e, res))
    });

// Login Route
router.route('/users/login')
    .post(function (req, res) {
      // console.log("Something fishy");
      //console.log(req);
      var email = req.body.email;
      if (email == null || req.body.password == null) {
        res.status(403).send('body missing email or password. is the form missing some fields?')
      }
      Users.findOne({
        where: { email: email }
      }).then(user => {
        if (user == null) {
          //console.log(user)
          res.status(404).send("User not found");
        } else if (authService.comparePasswords(req.body.password, user.password)) {
          //you'll need this for later
          //console.log(user.dataValues)
          user.save().then(
              u => {
                res.json({
                  ...u.dataValues,
                  token: authService.signUser(u)
                });
              }
          );

        } else {
          res.status(418).send("authentication failed. bad password.");
        }
      }).catch(e => defaultErr(e, res));
    });

//trust but verify user
router.post('/verify', function (req, res) {
  var token = req.headers.auth;
  //console.log(req.headers);
  console.log(token);
  authService.verifyUser(token, (err, decoded) => {
    if (err) {
      res.send(err);
    } else {
      // console.log(decoded)
      res.send("succes");
    }
  });
});

module.exports = router;
