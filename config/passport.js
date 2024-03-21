const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const { validatePassword } = require('../controller/commonController')
const User = require('../models/user')
require('dotenv').config({})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, done) => {
        const findUser = await User.findOne({ where: { email } })
        if (!findUser) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        if (!validatePassword(password, findUser.password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        if (!findUser.isAuthenticated) {
            return done(null, false, { message: 'User is not authenticated yet!' });
        }

        const payLoad = {
            id: findUser.id,
            userName: findUser.username,
            email: findUser.email
        }
        const token = jwt.sign(payLoad, process.env.JWT_SECRET);

        return done(null, { token, findUser });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await User.findOne({ where: { id } })
        done(null, findUser);
    } catch (error) {
        done(error);
    }
});

module.exports = passport