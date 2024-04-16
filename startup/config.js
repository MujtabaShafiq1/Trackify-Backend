require('dotenv').config();
const { configSchema } = require('../utils/validations/config-schema');

module.exports = () => {
	const config = {
		PORT: process.env.PORT,
		JWT_KEY: process.env.JWT_KEY,
		CLIENT_URL: process.env.CLIENT_URL,
		MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
		MINIO_PORT: process.env.MINIO_PORT,
		MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
		MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
		MINIO_USER_FACES_BUCKET: process.env.MINIO_USER_FACES_BUCKET,
		MINIO_BAGGAGES_BUCKET: process.env.MINIO_BAGGAGES_BUCKET,
	};

	const { error } = configSchema.validate(config);

	if (error) {
		throw new Error(`Config Error: ${error.details.map((i) => i.message).join(', ')}`);
	}
};
