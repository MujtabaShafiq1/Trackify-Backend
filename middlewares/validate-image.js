const { ContentSizeError, BadRequestError } = require('../utils/errors');

const validateImage = (req, res, next) => {
	const images = req.files;

	if (!images || images.length === 0) {
		throw BadRequestError('Atleast one image is required.');
	}

	for (const image of images) {
		// 1 Mb
		const maxFileSize = 1 * 1024 * 1024;
		const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg'];

		if (!allowedFormats.includes(image.mimetype)) {
			throw BadRequestError('Only PNG, JPG, and JPEG images are allowed.');
		}

		if (image.size > maxFileSize) {
			throw ContentSizeError(
				`Image size exceeds the maximum (${maxFileSize / 1024} MB) allowed limit. `
			);
		}
	}

	next();
};

module.exports = { validateImage };
