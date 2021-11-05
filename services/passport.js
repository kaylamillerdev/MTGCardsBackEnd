// Bring in the required libraries
import passport, { use, serializeUser, deserializeUser } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { users } from '../models';

// Configure the login validation
use(
    'local',
    new LocalStrategy(function (username, password, done) {
        users.findOne({ where: { Username: username } })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (user.Password !== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            })
            .catch(err => {
                if (err) { return done(err); }
            });
    })
);

// Stores the user id in the user session
serializeUser((user, callback) => {
    callback(null, user.UserId);
});

// Queries the database for the user details and adds to the request object in the routes
deserializeUser((id, callback) => {
    users
        .findByPk(id)
        .then(user => callback(null, user))
        .catch(err => callback(err));
});

export default passport;