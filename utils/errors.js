const { ERROR_CODES } = require('./constants');

module.exports.NotFoundError = (message) => {
	return {
		status: ERROR_CODES.NOT_FOUND,
		message: message,
	};
};

module.exports.BadRequestError = (message) => {
	return {
		status: ERROR_CODES.BAD_REQUEST,
		message: message,
	};
};

module.exports.ForbiddenAccessError = (message) => {
	return {
		status: ERROR_CODES.FORBIDDEN_ACCESS,
		message: message,
	};
};

module.exports.UnauthorizedError = (message) => {
	return {
		status: ERROR_CODES.UNAUTHORIZED,
		message: message,
	};
};

module.exports.ConflictError = (message) => {
	return {
		status: ERROR_CODES.CONFLICT,
		message,
	};
};

module.exports.ContentSizeError = (message) => {
	return {
		status: ERROR_CODES.CONTENT_T00_LARGE,
		message,
	};
};

module.exports.InternalServerError = (message) => {
	return {
		status: ERROR_CODES.INTERNAL_SERVER_ERROR,
		message: message,
	};
};
