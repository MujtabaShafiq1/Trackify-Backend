const Baggages = require('../models/baggages');

// utils
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../utils/errors');
const { createBucketsIfNotExists, uploadImage, deleteImage } = require('../utils/minio');

const getUserBaggages = async (req, res) => {
	const userId = req.params.id;
	const baggages = await Baggages.find({ userId });
	res.status(200).send(baggages);
};

const getBaggageById = async (req, res) => {
	const baggage = await Baggages.findById(req.params.id).populate('userId');
	if (!baggage) throw NotFoundError('Baggage not found');
	res.status(200).send(baggage);
};

const createBaggage = async (req, res) => {
	const images = [];
	const userId = req.user.id;
	const { color, category, brand } = req.body;

	await createBucketsIfNotExists();

	const uploadPromises = req.files.map((file) =>
		uploadImage(process.env.MINIO_USER_FACES_BUCKET, file)
	);
	const uploadedImages = await Promise.all(uploadPromises);
	images.push(...uploadedImages);

	const saved = await Baggages.create({ userId, images, color, category, brand });
	res.status(201).send(saved);
};

const uploadBaggageImages = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;

	const baggage = await Baggages.findById(id);
	if (!baggage) throw NotFoundError('Baggage not found');
	if (String(baggage.userId) !== userId) throw UnauthorizedError('User is not authorized');

	if (baggage.images.length + req.files.length > 10) {
		throw BadRequestError('Only 10 images are allowed');
	}

	const uploadPromises = req.files.map((file) =>
		uploadImage(process.env.MINIO_USER_FACES_BUCKET, file)
	);
	const uploadedImages = await Promise.all(uploadPromises);
	baggage.images.push(...uploadedImages);
	await baggage.save();

	res.status(200).send(baggage);
};

const deleteBaggageImage = async (req, res) => {
	let imageHash;
	const userId = req.user.id;
	const { baggageId, imageId } = req.params;

	const baggage = await Baggages.findById(baggageId);
	if (!baggage) throw NotFoundError('Baggage not found');
	if (String(baggage.userId) !== userId) throw UnauthorizedError('User is not authorized');

	const filteredImages = baggage.images.filter((v) => {
		if (String(v._id) === imageId) imageHash = v.fileHash;
		return String(v._id) !== imageId;
	});

	if (!imageHash) throw NotFoundError('Image not found');
	await deleteImage(process.env.MINIO_USER_FACES_BUCKET, imageHash);

	baggage.set({ images: filteredImages });
	await baggage.save();

	res.status(200).send({ message: 'Image deleted successfully' });
};

const deleteBaggage = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;

	const baggage = await Baggages.findById(id);
	if (!baggage) throw NotFoundError('Baggage not found');
	if (String(baggage.userId) !== userId) throw UnauthorizedError('User is not authorized');

	const deletePromises = baggage.images.map((image) =>
		deleteImage(process.env.MINIO_USER_FACES_BUCKET, image.fileHash)
	);
	await Promise.all(deletePromises);
	await baggage.deleteOne();

	res.status(200).send({ message: 'Baggage deleted successfully' });
};

module.exports = {
	getUserBaggages,
	getBaggageById,
	createBaggage,
	uploadBaggageImages,
	deleteBaggageImage,
	deleteBaggage,
};
