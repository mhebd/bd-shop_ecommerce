const express = require('express');
const { private, limited } = require('../middleware/auth');
const {
	createCartItem,
	fetchCartItems,
	updateCartItem,
	deleteCartItem,
} = require('../controller/cartItem');
const router = express.Router();

router.route('/').get(private, fetchCartItems).post(private, createCartItem);

router
	.route('/:id')
	.put(private, updateCartItem)
	.delete(private, deleteCartItem);

module.exports = router;
