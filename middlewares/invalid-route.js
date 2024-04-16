const { NotFoundError } = require('../utils/errors');

// middleware for invalid route
const invalidRouteMiddleware = (req, res, next) => {
	throw NotFoundError('Route not found');
};

module.exports = invalidRouteMiddleware;
