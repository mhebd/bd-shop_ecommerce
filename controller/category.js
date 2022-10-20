const {
	asyncHdl,
	errMsg,
	Result,
	CRUD: { findAll, updateOne, deleteOne, createOne },
} = require('../utility');
const Category = require('../model/Category');

/**
	=> @POST
	=> /api/v1/category
	=> Limited
*/
exports.createCategory = createOne(Category);

/**
	=> @GET
	=> /api/v1/category
	=> Public
*/
exports.fetchCategories = findAll(Category);

/**
	=> @PUT
	=> /api/v1/category/:id
	=> Limited
*/
exports.updateCategory = updateOne(Category);

/**
	=> @DELETE
	=> /api/v1/category/:id
	=> Limited
*/
exports.deleteCategory = deleteOne(Category);
