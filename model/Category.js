const mongoose = require('mongoose');

const CategoryModel = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Category name is mandetory'],
			unique: [true, 'Category name must be unique'],
		},
		icon: String,
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

const Category = mongoose.model('Category', CategoryModel);
module.exports = Category;
