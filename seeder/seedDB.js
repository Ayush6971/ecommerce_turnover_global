const user = require('../models/user')
const { hashPassword } = require('../controller/commonController')

async function seedData() {

    const findFirstUser = await user.findOne({ where: { email: 'admin@example.com' } })
    if (!findFirstUser) {
        await user.create({
            username: 'System User',
            email: 'admin@example.com',
            password: hashPassword('testPassword'),
        })
    }

}

module.exports = {
    seedData
}