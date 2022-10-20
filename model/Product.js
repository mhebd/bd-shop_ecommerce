const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Product name is mandetory'],
		},
		price: {
			type: Number,
			required: [true, 'Product price is mandetory'],
		},
		description: {
			type: String,
			required: [true, 'Product description is mandetory'],
		},
		discount: {
			type: Number,
			min: 0,
			max: 100,
			default: 0,
		},
		inStock: {
			type: Number,
			required: [true, 'Product stock information is mandetory'],
			min: 0,
			default: 1,
		},
		image: {
			type: String,
			required: [true, 'Product image is mandetory'],
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: [true, 'Product Category is mandetory'],
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

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
