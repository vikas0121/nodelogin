var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const validator = require("validator");
const SALT_WORK_FACTOR = 10;

userSchema = new Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid');
			}
		}
	},
	username: {
		type: String,
		trim: true,
		required: true
	},
	password: String,
	mobilenumber: {
		type: Number,
		trim: true
	}
});

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({
		email
	});
	if (!user)
		throw new Error('Unable to login!');

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch)
		throw new Error("Password does not match!");
	return user;
}

userSchema.pre("save", async function (next) {
	let user = this;
	if (user.isModified("password")) {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		user.password = await bcrypt.hash(user.password, salt, null);
	}
	next();
});

User = mongoose.model('User', userSchema);

module.exports = User;