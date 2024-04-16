const { createHash, randomBytes } = require('crypto');
const { minioClient } = require('../configs/minioConfig');
const appLogger = require('../utils/logger');

module.exports.createBucketsIfNotExists = async () => {
	try {
		const bucketNames = [process.env.MINIO_USER_FACES_BUCKET, process.env.MINIO_BAGGAGES_BUCKET];

		for (const bucketName of bucketNames) {
			const bucketExists = await minioClient.bucketExists(bucketName);
			if (!bucketExists) {
				await minioClient.makeBucket(bucketName);
				appLogger.info(`Bucket '${bucketName}' created successfully.`);
			}
		}
	} catch (error) {
		appLogger.error(`Error creating buckets: ${error}`);
		throw new Error('Failed to create MinIO bucket.');
	}
};

module.exports.uploadImage = async (bucketName, image) => {
	const fileName = image.originalname;

	// hash filename
	const iv = randomBytes(16);
	const dataToHash = fileName + iv.toString('hex');
	const objectName = createHash('sha256').update(dataToHash).digest('hex');

	// set metadata
	const metaData = { 'Content-Disposition': `attachment; filename="${fileName}"` };

	return new Promise((resolve, reject) => {
		minioClient.putObject(bucketName, objectName, image.buffer, metaData, (err, etag) => {
			if (err) {
				reject(err);
			} else {
				resolve({ fileHash: objectName, fileName, fileType: image.mimetype });
			}
		});
	});
};

module.exports.deleteImage = async (bucketName, fileHash) => {
	await minioClient.removeObject(bucketName, fileHash);
};
