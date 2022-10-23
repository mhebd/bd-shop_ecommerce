const CartItem = require('../model/CartItem');
const {
	asyncHdl,
	errMsg,
	Result,
	CRUD: { findAll },
} = require('../utility');

/**
  => @POST
  => /api/v1/cart-item
  => Private
*/
exports.createCartItem = asyncHdl(async (req, res, next) => {
	const { product, quantity } = req.body;
	const user = req.user.id;

	const cartItem = await CartItem.create({
		product,
		quantity,
		user,
	});

	res
		.status(200)
		.json(new Result(true, 'Cart item created success', { cartItem }));
});

/**
  => @GET
  => /api/v1/cart-item
  => Private
*/
exports.fetchCartItems = asyncHdl(async (req, res, next) => {
	const user = req.user.id;

	const cartItems = await CartItem.find({ user })
		.populate('product', ['name', 'price'])
		.sort('-created');

	res.status(200).json(new Result(true, '', { cartItems }));
});

/**
  => @PUT
  => /api/v1/cart-item/:id
  => Private
*/
exports.updateCartItem = asyncHdl(async (req, res, next) => {
	const { quantity } = req.body;
	const { id } = req.params;

	const item = await CartItem.findById(id);

	if (item.user.toString() !== req.user.id) {
		return next(new errMsg('You are not authorize to access this page.', 401));
	}

	const cartItem = await CartItem.findByIdAndUpdate(
		id,
		{ $set: { quantity } },
		{ new: true, runValidators: true }
	);

	res
		.status(200)
		.json(new Result(true, 'Cart item updated success', { cartItem }));
});

/**
  => @DELETE
  => /api/v1/cart-item/:id
  => Private
*/
exports.deleteCartItem = asyncHdl(async (req, res, next) => {
	const { id } = req.params;

	const item = await CartItem.findById(id);

	if (item.user.toString() !== req.user.id) {
		return next(new errMsg('You are not authorize to access this page.', 401));
	}

	const cartItem = await CartItem.findByIdAndDelete(id);

	res
		.status(200)
		.json(new Result(true, 'Cart item deleted success', { cartItem }));
});
