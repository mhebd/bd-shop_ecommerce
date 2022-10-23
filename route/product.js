const express = require('express');
const multer = require('multer');
const path = require('path');
const { private, limited } = require('../middleware/auth');
const {
	createProduct,
	fetchProducts,
	fetchProduct,
	updateProduct,
	deleteProduct,
} = require('../controller/product');
const router = express.Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads/product'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now();
		cb(null, uniqueSuffix + '-' + file.originalname);
	},
});

const upload = multer({ storage: storage });

router
	.route('/')
	.get(fetchProducts)
	.post(private, limited('admin'), upload.single('image'), createProduct);

router
	.route('/:id')
	.get(fetchProduct)
	.put(private, limited('admin'), upload.single('image'), updateProduct)
	.delete(private, limited('admin'), deleteProduct);

module.exports = router;
