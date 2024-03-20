const { createHmac, timingSafeEqual } = require('crypto')
const ejs = require('ejs')
require('dotenv').config({})


const hashPassword = (password) => {
    return createHmac('sha256', process.env.HASHSECRET).update(password).digest('hex')
}

const validatePassword = (inputPassword, existingPasswordHash) => {
    const inputHash = hashPassword(inputPassword)
    return timingSafeEqual(Buffer.from(inputHash), Buffer.from(existingPasswordHash))
}

const generateOTP = () => {
    const otpLength = 8;
    const min = Math.pow(10, otpLength - 1);
    const max = Math.pow(10, otpLength) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const renderTemplate = async (templatePath, dataObj) => {
    const emailTemplate = await ejs.renderFile(templatePath, dataObj)
    return emailTemplate;
}

module.exports = {
    hashPassword,
    validatePassword,
    generateOTP,
    renderTemplate
}