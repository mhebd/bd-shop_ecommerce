const Product = require('../model/Product');
const {
	asyncHdl,
	errMsg,
	Result,
	CRUD: { createOne, findAll, findOne, updateOne, deleteOne },
} = require('../utility');

/**
  => @POST
  => /api/v1/product
  => Limited
*/
exports.createProduct = createOne(Product, {
	destination: './uploads/product',
});

/**
  => @GET
  => /api/v1/product
  => Public
*/
exports.fetchProducts = findAll(
	Product,
	{ path: 'category', select: 'name' },
	'-created'
);

/**
  => @GET
  => /api/v1/product/:id
  => Public
*/
exports.fetchProduct = findOne(Product, { path: 'category', select: 'name' });

/**
  => @PUT
  => /api/v1/product/:id
  => Limited
*/
exports.updateProduct = updateOne(Product, {
	destination: './uploads/product',
});

/**
  => @DELETE
  => /api/v1/product/:id
  => Limited
*/
exports.deleteProduct = deleteOne(Product);
