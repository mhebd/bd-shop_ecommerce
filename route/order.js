const express = require('express');
const { private, limited } = require('../middleware/auth');
const {
	createOrder,
	fetchOrders,
	fetchAllOrders,
	updateOrder,
	deleteOrder,
} = require('../controller/order');
const {
	createPayment,
	paymentSuccess,
	paymentCancel,
} = require('../controller/payment');
const router = express.Router();

router.route('/').post(private, createOrder).get(private, fetchOrders);
router.route('/all').get(private, limited('admin'), fetchAllOrders);
router.route('/:id').put(private, updateOrder).delete(private, deleteOrder);

router.route('/payment/:orderId').post(private, createPayment);
router.route('/payment-success/:orderId').get(private, paymentSuccess);
router.route('/payment-cancel/:orderId').get(private, paymentCancel);

module.exports = router;
