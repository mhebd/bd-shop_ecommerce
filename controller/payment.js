const { asyncHdl, errMsg, Result } = require('../utility');
const Order = require('../model/Order');
const stripe = require('stripe')(process.env.STRIPE_KEY);

/**
	=> @POST
	=> /api/v1/order/payment/:orderId
	=> Private
*/
exports.createPayment = asyncHdl(async (req, res, next) => {
	const { orderId } = req.params;

	const order = await Order.findById(orderId).populate({
		path: 'products',
		populate: {
			path: 'product',
			model: 'Product',
			select: ['name', 'price', 'image', 'discount'],
		},
	});

	if (!order) {
		return next(new errMsg('No order found!', 404));
	}

	const line_items = order.products.map((item) => {
		let price = item.product.price;
		if (item.product.discount) {
			price = price - price * (item.product.discount / 100);
		}

		return {
			price_data: {
				currency: 'usd',
				product_data: {
					name: item.product.name,
				},
				unit_amount: price * 100,
			},
			quantity: item.quantity,
		};
	});

	const session = await stripe.checkout.sessions.create({
		line_items,
		mode: 'payment',
		metadata: {
			paymentSecret: process.env.PAYMENT_SECRET,
		},
		success_url: `http://localhost:5000/api/v1/order/payment-success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `http://localhost:5000/api/v1/order/payment-cancel/${orderId}`,

		shipping_address_collection: {
			allowed_countries: ['BD', 'US', 'IN'],
		},
		shipping_options: [
			{
				shipping_rate_data: {
					type: 'fixed_amount',
					fixed_amount: {
						amount: 0,
						currency: 'usd',
					},
					display_name: 'Free shipping',
					// Delivers between 5-7 business days
					delivery_estimate: {
						minimum: {
							unit: 'business_day',
							value: 5,
						},
						maximum: {
							unit: 'business_day',
							value: 7,
						},
					},
				},
			},
			{
				shipping_rate_data: {
					type: 'fixed_amount',
					fixed_amount: {
						amount: 1500,
						currency: 'usd',
					},
					display_name: 'Next day air',
					// Delivers in exactly 1 business day
					delivery_estimate: {
						minimum: {
							unit: 'business_day',
							value: 1,
						},
						maximum: {
							unit: 'business_day',
							value: 1,
						},
					},
				},
			},
		],
	});

	res
		.status(200)
		.json(
			new Result(true, 'Use this url to make payment', { url: session.url })
		);
});

/**
	=> @POST
	=> /api/v1/order/payment-success/:orderId
	=> Private
*/
exports.paymentSuccess = asyncHdl(async (req, res, next) => {
	const {
		status,
		payment_status,
		metadata: { paymentSecret },
		shipping_details,
	} = await stripe.checkout.sessions.retrieve(req.query.session_id);

	let order;
	if (
		status === 'complete' &&
		payment_status === 'paid' &&
		paymentSecret === process.env.PAYMENT_SECRET
	) {
		order = await Order.findByIdAndUpdate(
			req.params.orderId,
			{ $set: { paymentStatus: 'Complete', shipping_details } },
			{ new: true, runValidators: true }
		);
	}

	res.status(200).json(new Result(true, 'Payment success!', { order }));
});

/**
	=> @POST
	=> /api/v1/order/payment-cancel
	=> Private
*/
exports.paymentCancel = asyncHdl(async (req, res, next) => {
	const { orderId } = req.params;

	res
		.status(200)
		.json(
			new Result(true, 'Payment cancel. Something went wrong!', { orderId })
		);
});
