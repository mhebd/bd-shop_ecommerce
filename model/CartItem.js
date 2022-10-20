const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'product',
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	created: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false,
	toJSON: { vertuals: true },
	toObject: { vertuals: true }
})

const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;	