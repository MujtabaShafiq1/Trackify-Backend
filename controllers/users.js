const jwt = require('jsonwebtoken');
const Users = require('../models/users');

// utils
const { ROLES } = require('../utils/constants');
const { comparePasswords } = require('../utils/password-hash');
const {
	NotFoundError,
	UnauthorizedError,
	ConflictError,
	ForbiddenAccessError,
	BadRequestError,
} = require('../utils/errors');

const userDetails = async (req, res) => {
	const user = await Users.findById(req.user.id);
	res.status(200).send(user);
};

const login = async (req, res) => {
	const { username, password: userPassword } = req.body;

	const user = await Users.findOne({ username }).lean().select('+password');
	if (!user) throw NotFoundError('User not found');

	const isMatch = await comparePasswords(userPassword, user.password);
	if (!isMatch) throw UnauthorizedError('Invalid Credentials');

	if (user.role === ROLES.USER && !user.isApproved)
		throw ForbiddenAccessError('User is not approved by Admin');

	const token = jwt.sign({ id: user._id, username, role: user.role }, process.env.JWT_KEY, {
		expiresIn: '7d',
	});

	const { password, ...userDetails } = user;
	return res.status(200).send({ user: { ...userDetails }, token });
};

const signup = async (req, res) => {
	const { username, password, firstName, lastName, contactNumber, position } = req.body;

	let user = await Users.findOne({ username });
	if (user) throw ConflictError('Username is taken');

	await Users.create({
		username,
		password,
		firstName,
		lastName,
		contactNumber,
		position,
	});

	res.status(201).send({ message: 'Account created successfully' });
};

const updateUser = async (req, res) => {
	const { username, firstName, lastName, contactNumber, position } = req.body;

	const user = await Users.findOneAndUpdate(
		{ username },
		{ firstName, lastName, contactNumber, position },
		{ new: true }
	).lean();

	if (!user) throw NotFoundError('User not found');

	return res.status(200).send(user);
};

const grantAdmin = async (req, res) => {
	const { id } = req.params;

	const user = await Users.findById(id);
	if (!user) throw NotFoundError('User not found');

	user.set({ role: ROLES.ADMIN });
	await user.save();

	return res.status(200).send(`Role updated to ${user.role}`);
};

const approveUser = async (req, res) => {
	const { id } = req.params;

	const user = await Users.findById(id);
	if (!user) throw NotFoundError('User not found');

	if (user.isApproved) throw BadRequestError('User is already approved');

	user.set({ isApproved: true });
	await user.save();

	return res.status(200).send('User is Approved');
};

module.exports = {
	login,
	signup,
	userDetails,
	updateUser,
	grantAdmin,
	approveUser,
};
