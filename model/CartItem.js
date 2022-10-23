const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: [true, 'Product id is mandatory'],
		},
		quantity: {
			type: Number,
			min: 1,
			required: [true, 'Product quantity is mandatory'],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User id is mandatory'],
		},
		created: {
			type: Date,
			default: Date.now,
		},
	},
	{
		versionKey: false,
		toJSON: { vertuals: true },
		toObject: { vertuals: true },
	}
);

const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;
