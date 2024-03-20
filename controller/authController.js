const passport = require('passport');
const { hashPassword } = require('./commonController');
const User = require('../models/user');
require('dotenv').config({})

const getLoginPage = async (req, res) => {
    return res.render('login');
}

const login = (req, res, next) => {
    try {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: info.message });
            }

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            };
            res.cookie("jwt", user.token, cookieOptions);

            return res.redirect('/dashboard');
        })(req, res, next);
    } catch (err) {
        console.log("🚀 ~ login ~ err:", err)
        throw new Error(err)
    }
};

const logout = (req, res) => {
    try {
        req.logout();
        res.clearcookie()
        return res.status(200).send({ message: 'Logged out successfully' })
    } catch (error) {
        console.log("🚀 ~ logout ~ err:", error)
        throw new Error(err)
    }
};

const getSignUpPage = async (req, res) => {
    return res.render('signUp');
}

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(401).json({ message: 'All fields are mandatory' })
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashPassword(password),
        });

        return res.status(201).json({ message: 'User created successfully' });

    } catch (err) {
        console.log("🚀 ~ login ~ err:", err)
        throw new Error(err)
    }
};


module.exports = {
    getLoginPage,
    login,
    logout,
    getSignUpPage,
    signUp
}