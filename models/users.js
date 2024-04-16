const mongoose = require('mongoose');
const { ROLES } = require('../utils/constants');
const { hashPassword } = require('../utils/password-hash');

const usersSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			index: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		role: {
			type: String,
			default: ROLES.USER,
			enum: Object.values(ROLES),
		},
		position: {
			type: String,
			required: true,
		},
		contactNumber: {
			type: String,
			required: true,
		},
		isApproved: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

// Password Hashing
usersSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await hashPassword(this.password);
	}
	next();
});

module.exports = mongoose.model('Users', usersSchema);
