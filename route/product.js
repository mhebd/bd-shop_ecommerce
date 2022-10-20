const express = require('express');
const { private, limited } = require('../middleware/auth');
const {
	createProduct,
	fetchProducts,
	fetchProduct,
	updateProduct,
	deleteProduct,
} = require('../controller/product');
const router = express.Router();

router
	.route('/')
	.get(fetchProducts)
	.post(private, limited('admin'), createProduct);

router
	.route('/:id')
	.get(fetchProduct)
	.put(private, limited('admin'), updateProduct)
	.delete(private, limited('admin'), deleteProduct);

module.exports = router;
