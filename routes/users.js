const express = require('express');
const router = express.Router();
const user = require('../models/userModel');
const cardData = require('../seededData/cards');


/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get("/signup", function(req, res){
  res.render('signup');
});

router.post("/signup", function( req, res){
  const newUser = new user({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    cardsOwned: cardData
  });

  console.log(newUser);
  newUser.save().then(userData => {
    console.log('Save Successful: ' + userData);
    //res.redirect('/users/login'); <= use for backend render only
    res.send("signup successful: " + userData);
  })
      .catch(err => {
        res.status(400).send("unable to save to database because of " + err);
      });
});

router.get('/login', function(req, res){
  res.render('login');
});

router.post('/login', function( req, res){
  let username = req.body.username;
  let password = req.body.password;
  const query = user.findOne({username: username});
  query.exec(function(err, user){
    if(err) return err;
    if(password == user.password){
      //res.redirect('/users/profile/' + user.username); <= use for backend rendering only
      res.send(user);
    } else {
      res.send('Invalid Login!');
    }
  });
});

router.get('/profile/:username', function(req, res) {
  user.findOne({username: req.params.username}).then(user => {
    if(user){
      res.render('profile', {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        cardsOwned: user.cardsOwned
      });
    } else {
      res.send('User not found');
    }
  })
});

module.exports = router;
