const express = require('express');

const { private, limited } = require('../middleware/auth');
const {
	createUser,
	verifyUser,
	loginUser,
	getUser,
	getUserById,
	deleteUser,
	updateUser,
	getAllUser,
	deleteUserByAdmin,
} = require('../controller/user');
const router = express.Router();

router
	.route('/')
	.get(private, getUser)
	.put(private, updateUser)
	.delete(private, deleteUser);
router.route('/all').get(private, limited('admin'), getAllUser);
router.route('/signup').post(createUser);
router.route('/verify').get(verifyUser);
router.route('/login').post(loginUser);
router
	.route('/:id')
	.get(private, getUserById)
	.delete(private, limited, deleteUserByAdmin);

module.exports = router;
