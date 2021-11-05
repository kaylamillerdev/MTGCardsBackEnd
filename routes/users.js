import { Router } from 'express';
const router = Router();
import { Users, Cards } from '../models'; //<--- Add models
import { hashPassword, comparePasswords, signUser, verifyUser } from '../services/auth'; //<--- Add authentication service
import cors from 'cors';
const corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200
};

/* GET users listing. */
router.get('/', cors(corsOptions), function (req, res, next) {
    res.send('respond with a resource');
});
// GET signup page when navigate to users/signup
router.get('/signup', cors(corsOptions), function(req, res, next) {
    res.render('signup');
})
// Create new user if one doesn't exist
router.post('/signup', cors(corsOptions), function(req, res, next) {
    Users
        .findOrCreate({
            where: {
                Username: req.body.Username
            },
            defaults: {
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Email: req.body.Email,
                Password: hashPassword(req.body.Password)
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
router.post('/login', cors(corsOptions), function (req, res, next) {
    Users.findOne({
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
            let passwordMatch = comparePasswords(req.body.Password, user.Password);
            console.log(passwordMatch);
            if (passwordMatch) {
                let token = signUser(user);
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
router.get("/profile", cors(corsOptions), function(req, res, next) {
    let token = req.cookies.jwt;
    if (token) {
        verifyUser(token).then(user => {
            if (user) {
                Users
                    .findAll({
                        where: { UserId: user.UserId },
                        include: [{ model: Cards }]
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
router.get('/logout', cors(corsOptions), function (req, res, next) {
    res.cookie('jwt', "", { expires: new Date(0) });
    //res.render('logout');
});

router.post('profile', cors(corsOptions), function(req, res, next) {
    res.render('profile');
})

export default router;