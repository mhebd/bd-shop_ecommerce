const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../config/.env" });

const mailer = async (to, subject, template) => {
	const transporter = await nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.MAIL,
			pass: process.env.MAIL_PASS,
		},
	});

	const data = {
		from: "mhe.test.mail@gmail.com",
		to,
		subject,
		html: template,
	};

	await transporter.sendMail(data, (err) => {
		if (err) {
			console.log(err);
			return false;
		} else {
			console.log("mail send success.");
			return true;
		}
	});
};

module.exports = mailer;
