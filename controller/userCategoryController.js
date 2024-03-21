const Category = require('../models/category')
const UserCategories = require('../models/userCategories')
const User = require('../models/user');
const { sequelize } = require('../models/');

const renderMarkInterests = async (req, res) => {
    try {
        return res.render('markInterests', { req })
    } catch (error) {
        console.error("🚀 ~ renderMarkInterests ~ error:", error)
        throw new Error(error)
    }
}

const getCategories = async (req, res) => {
    try {
        const userId = req?.user?.id;

        console.log("🚀 ~ getCategories ~ req.query.page:", req.query.page)
        const currentPage = parseInt(req.query.page) || 1;
        const limit = 6;
        const offset = (currentPage - 1) * limit;

        const categoriesFromCategoryTable = await Category.findAll({
            limit,
            offset,
            attributes: ['id', 'name'],
        });

        const userCategories = await UserCategories.findAll({
            where: { userId },
            attributes: ['categoryId'],
            raw: true,
        });

        const userCategoryIds = new Set(userCategories.map(category => category.categoryId));

        const categories = categoriesFromCategoryTable.map(category => {
            return {
                id: category.id,
                name: category.name,
                checked: userCategoryIds.has(category.id) ? true : false
            };
        });

        const totalCount = await Category.count();
        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({ message: 'Categories fetched successfully', categories, totalPages, currentPage });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const addRemoveUserCategory = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const userId = req?.user?.id
        const { categoryId } = req.body;

        const findUser = await User.findOne({ where: { id: userId }, transaction: t })
        if (!findUser) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        const findCategory = await Category.findOne({ where: { id: categoryId }, transaction: t })
        if (!findCategory) {
            return res.status(400).json({
                message: 'Category not found'
            });
        }

        const existingUserCategory = await UserCategories.findOne({
            where: {
                userId: userId,
                categoryId: categoryId
            }, transaction: t
        });

        if (existingUserCategory) {
            await UserCategories.destroy({
                where: {
                    userId: userId,
                    categoryId: categoryId
                }
            }, {
                transaction: t
            })
            await t.commit()
            return res.status(200).json({ message: 'User Category removed successfully' });
        }

        await UserCategories.create({
            userId: userId,
            categoryId: categoryId
        }, { transaction: t });

        await t.commit()
        return res.status(200).json({ message: 'User Category saved successfully' });
    } catch (error) {
        console.error('Error saving userCategory:', error);
        await t.rollback()
        throw new Error(error)
    }
}
module.exports = {
    getCategories,
    renderMarkInterests,
    addRemoveUserCategory
}