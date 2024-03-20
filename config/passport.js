const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const { validatePassword } = require('../controller/commonController')
const user = require('../models/user')
require('dotenv').config({})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, done) => {
        const findUser = await user.findOne({ where: { email } })
        if (!findUser) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        if (!validatePassword(password, findUser.password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        const payLoad = {
            id: findUser.id,
            userName: findUser.firstName + ' ' + findUser.lastName,
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
        const findUser = await user.findOne({ id, include: 'role' })
        done(null, findUser);
    } catch (error) {
        done(error);
    }
});

module.exports = passport