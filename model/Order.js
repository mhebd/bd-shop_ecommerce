const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
	{
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				}
			}
		],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			default: 'Accepted',
			enum: ['Accepted', 'Processing', 'Shipped', 'Delivered'],
		},
		totalPrice: {
			type: Number,
			required: true,
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

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
