const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
	{
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: [true, 'For order Product is mandatery'],
				},
				quantity: {
					type: Number,
					min: 1,
					required: [true, 'For order Product quantity is mandatery'],
				},
			},
		],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'For order User is mandatery'],
		},
		status: {
			type: String,
			default: 'Accepted',
			enum: ['Accepted', 'Processing', 'Shipped', 'Delivered'],
		},
		paymentStatus: {
			type: String,
			default: 'Incomplete',
			enum: ['Incomplete', 'Complete'],
			required: true,
		},
		shipping_details: {
			address: {
				city: String,
				country: String,
				line1: String,
				line2: String,
				postal_code: Number,
				state: String,
			},
			name: String,
		},
		totalPrice: {
			type: Number,
			min: 0,
			required: [true, 'For order total price is mandatery'],
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

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
