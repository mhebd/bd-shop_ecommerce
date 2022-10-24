const Order = require('../model/Order');
const CartItem = require('../model/CartItem');
const {
	asyncHdl,
	errMsg,
	Result,
	CRUD: { findAll },
} = require('../utility');

/**
  => @POST
  => /api/v1/order
  => Private
*/
exports.createOrder = asyncHdl(async (req, res, next) => {
	const user = req.user.id;

	const cartItems = await CartItem.find({ user }).populate('product');

	if (cartItems.length <= 0) {
		return next(new errMsg('You have no selected porduct for order', 404));
	}

	const products = cartItems.map((item) => {
		return {
			product: item.product._id,
			quantity: item.quantity,
		};
	});

	const totalPrice = cartItems.reduce((total, item) => {
		let price = item.product.price;
		if (item.product.discount) {
			price = price - price * (item.product.discount / 100);
		}

		return total + item.quantity * price;
	}, 0);

	const order = await Order.create({
		products,
		user,
		totalPrice,
	});

	if (order) {
		cartItems.forEach(async (item) => {
			await CartItem.findByIdAndDelete(item._id);
		});
	}

	res.status(200).json(new Result(true, 'Order created success', { order }));
});

/**
  => @GET
  => /api/v1/order
  => Private
*/
exports.fetchOrders = asyncHdl(async (req, res, next) => {
	const user = req.user.id;

	const orders = await Order.find({ user })
		.sort('-created')
		.populate({
			path: 'products',
			populate: {
				path: 'product',
				model: 'Product',
			},
		});

	res.status(200).json(new Result(true, '', { orders }));
});

/**
  => @GET
  => /api/v1/order/all
  => Limited
*/
exports.fetchAllOrders = findAll(Order, {
	path: 'products',
	populate: {
		path: 'product',
		model: 'Product',
	},
});

/**
  => @PUT
  => /api/v1/order/:id
  => Private
*/
exports.updateOrder = asyncHdl(async (req, res, next) => {
	const { status } = req.body;
	const { id } = req.params;

	const order = await Order.findByIdAndUpdate(
		id,
		{ $set: { status } },
		{ new: true, runValidators: true }
	);

	res.status(200).json(new Result(true, 'Order updated success', { order }));
});

/**
  => @DELETE
  => /api/v1/order/:id
  => Private
*/
exports.deleteOrder = asyncHdl(async (req, res, next) => {
	const user = req.user.id;
	const { id } = req.params;

	const order = await Order.findById(id);

	if (order.status === 'Accepted' && order.user.toString() === user) {
		await Order.findByIdAndDelete(id);
	} else {
		return next(new errMsg("Order Can't be deleted", 401));
	}

	res.status(200).json(new Result(true, 'Order Deletd success', null));
});
