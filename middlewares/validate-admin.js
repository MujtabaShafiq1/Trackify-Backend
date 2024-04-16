const { ROLES } = require('../utils/constants');
const { ForbiddenAccessError } = require('../utils/errors');

const validateAdmin = (req, res, next) => {
	const { role } = req.user;

	if (role !== ROLES.ADMIN) {
		throw ForbiddenAccessError('Admin Access Required');
	}

	next();
};

module.exports = { validateAdmin };
