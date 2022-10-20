const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const {
	asyncHdl,
	errMsg,
	Result,
	CRUD: { findOne, findAll, deleteOne },
	mailer,
} = require('../utility');

/**
	=> @POST
	=> /api/v1/user
	=> Public
*/
exports.createUser = asyncHdl(async (req, res, next) => {
	const { name, email, password, password2 } = req.body;

	// Chack password & confirm password match
	if (password !== password2) {
		return next(
			new errMsg('Your password and confirm password did not match', 400)
		);
	}

	// Create gravatar
	const gravatarUrl = gravatar.url(email, { s: 200, r: 'x', d: 'retro' }, true);

	// Create user
	const user = await User.create({
		name,
		email,
		password,
		gravatar: gravatarUrl,
	});

	// Create token
	const token = await user.getValidateToken();

	// Create template
	const template = `
	 	<div>
	 		<p>Welcome, ${user.name}</p>
	 		<P>Thanks to signup here</P>
	 		<p>To active your accont <a target="_blank" href="http://localhost:5000/api/v1/user/verify?token=${token}">Click here</a> or copy blow link and past in a browser tab.</p>

	 		<p>http://localhost:5000/api/v1/user/verify?token=${token}</p>
	 	</div>
	  `;

	const mailed = mailer(user.email, 'Verify user mail', template);

	if (!mailed) {
		await User.findByIdAndDelete(user._id);
		return next(new errMsg('Somthing went wrong! Try again.', 404));
	}

	res
		.status(201)
		.json(
			new Result(
				true,
				'Signup Successfull. Please check your eamil to varify your account.',
				null
			)
		);
});

/**
	=> @GET
	=> /api/v1/user/verify
	=> Public
*/
exports.verifyUser = asyncHdl(async (req, res, next) => {
	const { token } = req.query;

	const { id } = await jwt.verify(token, process.env.SECRET);

	if (!id) {
		return next(new errMsg('Something went wrong!', 500));
	}

	const user = await User.findByIdAndUpdate(
		id,
		{ $set: { active: true } },
		{ new: true }
	);

	res.status(200).json(new Result(true, 'User activeted success.', { user }));
});

/**
	=> @POST
	=> /api/v1/user
	=> Public
*/
exports.loginUser = asyncHdl(async (req, res, next) => {
	const { email, password } = req.body;

	// Check any fields are not missing
	if (!email || !password) {
		return next(new errMsg('All the fields are required', 400));
	}

	// Chack has user
	const user = await User.findOne({ email });
	if (!user) {
		return next(new errMsg('User not found', 404));
	}

	// Varify passwrod
	if (!(await bcrypt.compare(password, user.password))) {
		return next(new errMsg('Email & passwrod did not match', 404));
	}

	// Prevent inactive account
	if (!user.active) {
		return next(new errMsg('Please activet your account first.', 401));
	}

	// Create token
	const token = await user.getToken();

	res.status(201).json(new Result(true, 'Login Successfull.', { user, token }));
});

/**
	=> @GET
	=> /api/v1/user
	=> Private
*/
exports.getUser = asyncHdl(async (req, res, next) => {
	const { id } = req.user;
	const user = await User.findById(id).select('-password');

	res.status(200).json(new Result(true, '', { user }));
});

/**
	=> @GET
	=> /api/v1/user/:id
	=> Private
*/
exports.getUserById = findOne(User);

/**
	=> @PUT
	=> /api/v1/user
	=> Private
*/
exports.updateUser = asyncHdl(async (req, res, next) => {
	const { id } = req.user;
	const {
		name,
		phone,
		age,
		sex,
		address1,
		address2,
		city,
		country,
		zipCode,
		biodata,
	} = req.body;

	// Create empty Object
	let updatedUser = {};
	updatedUser.contact = {};

	// Set fields
	if (name) updatedUser.name = name;
	if (phone) updatedUser.phone = phone;
	if (age) updatedUser.age = age;
	if (sex) updatedUser.sex = sex;
	if (address1) updatedUser.contact.address1 = address1;
	if (address2) updatedUser.contact.address2 = address2;
	if (city) updatedUser.contact.city = city;
	if (country) updatedUser.contact.country = country;
	if (zipCode) updatedUser.contact.zipCode = zipCode;
	if (biodata) updatedUser.biodata = biodata;

	// Update user
	const user = await User.findByIdAndUpdate(
		id,
		{ $set: updatedUser },
		{ new: true }
	);

	res.status(200).json(new Result(true, 'User Updated successfull.', { user }));
});

/**
	=> @DELETE
	=> /api/v1/user
	=> Private
*/
exports.deleteUser = asyncHdl(async (req, res, next) => {
	const { id } = req.user;
	await User.findByIdAndDelete(id);

	res.status(200).json(new Result(true, 'User Deleted successfull.', null));
});

/**
 * *****************************************
 * 				For Admin Section
 * *****************************************
 */

/**
	=> @GET
	=> /api/v1/user/all
	=> Limited
*/
exports.getAllUser = findAll(User);

/**
	=> @DELETE
	=> /api/v1/user/:id
	=> Limited
*/
exports.deleteUserByAdmin = deleteOne(User);
