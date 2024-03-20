const passport = require('passport');
const { hashPassword, generateOTP, renderTemplate } = require('./commonController');
const User = require('../models/user');
const { sendEmail } = require('../utils/email')
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

        const newUser = await User.create({
            username,
            email,
            password: hashPassword(password),
        });

        const otp = generateOTP()

        const authEmail = __dirname + '/../views/emails/authEmail.ejs'

        const mailOptions = {
            to: email,
            subject: 'Welcome to Ecommerce!',
            html: await renderTemplate(authEmail, { otp })
        }

        await sendEmail(mailOptions)

        User.update({ otp }, { where: { id: newUser.id } })
        return res.render('verifyOtp', { email: newUser.email })
    } catch (err) {
        console.log("🚀 ~ login ~ err:", err)
        throw new Error(err)
    }
};

const verify = async (req, res) => {
    try {
        const { otp, email } = req.body;
        if (!otp || !email) {
            return res.status(401).json({ message: 'All fields are mandatory' })
        }

        const findUser = await User.findOne({ where: { email } });
        if (!findUser) {
            return res.status(400).json({
                message: 'Email not found'
            });
        }
        if (Number(otp) !== Number(findUser.otp)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        await User.update({ isAuthenticated: true }, { id: findUser.id });

        return res.status(200).json({ message: 'Email verified successfully' });

    } catch (err) {
        console.log("🚀 ~ login ~ err:", err)
        throw new Error(err)
    }
}

module.exports = {
    getLoginPage,
    login,
    logout,
    getSignUpPage,
    signUp,
    verify
}