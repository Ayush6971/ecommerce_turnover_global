const jwt = require('jsonwebtoken');
const user = require('../models/user')
require('dotenv').config({})

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req?.headers?.cookie;
        const token = authHeader && authHeader?.split("=")[1];

        if (!token) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized - Missing Token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const requestUser = await user.findOne({ where: { id: decoded.id, isDisabled: false } })
        if (!requestUser) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid User' });
        }

        req.user = {
            id: decoded.id,
            userName: decoded.userName,
            email: decoded.email,
        };

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid Token' });
    }
};

module.exports = authenticate;
