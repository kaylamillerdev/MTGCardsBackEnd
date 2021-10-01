var express = require('express');
var router = express.Router();
var models = require('../models'); //<--- Add models
var authService = require('../services/auth'); //<--- Add authentication service

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
// GET signup page when navigate to users/signup
router.get('/signup', function(req, res, next) {
    res.render('signup');
})
// Create new user if one doesn't exist
router.post('/signup', function(req, res, next) {
    models.users
        .findOrCreate({
            where: {
                Username: req.body.Username
            },
            defaults: {
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Email: req.body.Email,
                Password: authService.hashPassword(req.body.Password)
            }
        })
        .spread(function(result, created) {
            if (created) {
                //res.send('User successfully created');
                res.send(JSON.stringify({redirect: '/login'}));
            } else {
                res.send('This user already exists');
            }
        });
});
// Login user and return JWT as cookie
router.post('/login', function (req, res, next) {
    models.users.findOne({
        where: {
            Username: req.body.Username
        }
    }).then(user => {
        console.log("in the login route");
        if (!user) {
            console.log('User not found')
            return res.status(401).json({
                message: "Login Failed"
            });
        } else {
            let passwordMatch = authService.comparePasswords(req.body.Password, user.Password);
            console.log(passwordMatch);
            if (passwordMatch) {
                let token = authService.signUser(user);
                res.cookie('jwt', token);
                res.send(JSON.stringify({redirect: '/home'}));
            } else {
                console.log('Wrong password');
                res.send('Wrong password');
            }
        }
    });
});

//  GET profile page of user that's currently logged in
router.get("/profile", function(req, res, next) {
    let token = req.cookies.jwt;
    if (token) {
        authService.verifyUser(token).then(user => {
            if (user) {
                models.users
                    .findAll({
                        where: { UserId: user.UserId },
                        include: [{ model: models.posts }]
                    })
                    .then(result => {
                        console.log(result);
                        res.render("profile", { user: result[0] });
                    });
            } else {
                res.status(401);
                res.send("Invalid authentication token");
            }
        });
    } else {
        res.status(401);
        res.send("Must be logged in");
    }
});

//get logout screen!
router.get('/logout', function (req, res, next) {
    res.cookie('jwt', "", { expires: new Date(0) });
    //res.render('logout');
});

router.post('profile', function(req, res, next) {
    res.render('profile');
})

module.exports = router;