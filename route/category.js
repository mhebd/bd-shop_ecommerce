const express = require('express');
const { private, limited } = require('../middleware/auth');
const {
	createCategory,
	fetchCategories,
	updateCategory,
	deleteCategory,
} = require('../controller/category');
const router = express.Router();

router
	.route('/')
	.get(fetchCategories)
	.post(private, limited('admin'), createCategory);

router
	.route('/:id')
	.put(private, limited('admin'), updateCategory)
	.delete(private, limited('admin'), deleteCategory);

module.exports = router;
