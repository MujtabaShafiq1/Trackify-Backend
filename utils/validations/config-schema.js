const Joi = require('../joi-instance');

const configSchema = Joi.object({
	PORT: Joi.string().required(),
	JWT_KEY: Joi.string().required(),
	CLIENT_URL: Joi.string().required(),
	MINIO_ENDPOINT: Joi.string().required(),
	MINIO_PORT: Joi.string().required(),
	MINIO_ACCESS_KEY: Joi.string().required(),
	MINIO_SECRET_KEY: Joi.string().required(),
	MINIO_USER_FACES_BUCKET: Joi.string().required(),
	MINIO_BAGGAGES_BUCKET: Joi.string().required(),
});

module.exports = {
	configSchema,
};
