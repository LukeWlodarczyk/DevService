const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre('save', function(next) {
	if (!this.isModified('password')) {
		return next();
	}

	bcrypt.hash(this.password, 10, (err, hash) => {
		if (err) return next(err);
		this.password = hash;
		next();
	});
});

UserSchema.methods.comparePassword = async function comparePassword(
	candidatePassword
) {
	return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User = mongoose.model('users', UserSchema);
