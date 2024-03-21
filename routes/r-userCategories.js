const express = require('express');
const router = express.Router();
const userCategoryController = require('../controller/userCategoryController');

router.get('/mark-interests', userCategoryController.renderMarkInterests)
router.get('/categories', userCategoryController.getCategories)
router.post('/add-remove-category', userCategoryController.addRemoveUserCategory)

module.exports = router;