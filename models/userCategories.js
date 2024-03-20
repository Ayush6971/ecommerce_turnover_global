const { sequelize } = require('./index')
const user = require('./user');
const Category = require('./category');

const userCategories = sequelize.define('userCategories', {}, {
    tableName: 'userCategories'
});

userCategories.belongsTo(user, { foreignKey: 'userId' });
userCategories.belongsTo(Category, { foreignKey: 'categoryId' })

module.exports = userCategories