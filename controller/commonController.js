const { createHmac, timingSafeEqual } = require('crypto')
require('dotenv').config({})


const hashPassword = (password) => {
    return createHmac('sha256', process.env.HASHSECRET).update(password).digest('hex')
}

const validatePassword = (inputPassword, existingPasswordHash) => {
    const inputHash = hashPassword(inputPassword)
    return timingSafeEqual(Buffer.from(inputHash), Buffer.from(existingPasswordHash))
}

module.exports = {
    hashPassword,
    validatePassword,

}