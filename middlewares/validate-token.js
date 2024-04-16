const jwt = require('jsonwebtoken');
const { ERROR_CODES } = require('../utils/constants');

// authenticate user
const validateToken = (req, res, next) => {
	const authorizationHeader = req.header('Authorization');

	if (!authorizationHeader) {
		return res.status(ERROR_CODES.FORBIDDEN_ACCESS).json({ message: 'User is not logged in.' });
	}

	const tokenArray = authorizationHeader.split(' ');
	if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
		return res.status(ERROR_CODES.BAD_REQUEST).json({ message: 'Invalid token format.' });
	}

	const token = tokenArray[1];
	const decoded = jwt.verify(token, process.env.JWT_KEY);
	req.user = decoded;
	next();
};

module.exports = { validateToken };
