const user = require('../models/user')
const category = require('../models/category');
const { faker } = require('@faker-js/faker');
const { hashPassword } = require('../controller/commonController')

async function seedData() {

    const findFirstUser = await user.findOne({ where: { email: 'admin@example.com' } })
    if (!findFirstUser) {
        await user.create({
            username: 'System User',
            email: 'admin@example.com',
            password: hashPassword('testPassword'),
            isAuthenticated: true
        })
    }

    const categoryCount = await category.count({})

    if (categoryCount < 100) {

        const categoriesData = [];
        for (let i = 0; i < 100; i++) {
            categoriesData.push({ name: faker.commerce.department() });
        }

        await category.bulkCreate(categoriesData)
    }
}

module.exports = {
    seedData
}