const Faces = require('../models/faces');

// utils
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../utils/errors');
const { createBucketsIfNotExists, uploadImage, deleteImage } = require('../utils/minio');

const getUserFaces = async (req, res) => {
	const userId = req.params.id;
	const userFaces = await Faces.find({ userId });
	res.status(200).send(userFaces);
};

const getFaceById = async (req, res) => {
	const face = await Faces.findById(req.params.id).populate('userId');
	if (!face) throw NotFoundError('User Face not found');
	res.status(200).send(face);
};

const createUserFace = async (req, res) => {
	const images = [];
	const userId = req.user.id;

	await createBucketsIfNotExists();

	const uploadPromises = req.files.map((file) =>
		uploadImage(process.env.MINIO_USER_FACES_BUCKET, file)
	);
	const uploadedImages = await Promise.all(uploadPromises);
	images.push(...uploadedImages);

	const saved = await Faces.create({ userId, images });
	res.status(201).send(saved);
};

const uploadFaceImages = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;

	const face = await Faces.findById(id);
	if (!face) throw NotFoundError('User Face not found');
	if (String(face.userId) !== userId) throw UnauthorizedError('User is not authorized');

	if (face.images.length + req.files.length > 10) {
		throw BadRequestError('Only 10 images are allowed');
	}

	const uploadPromises = req.files.map((file) =>
		uploadImage(process.env.MINIO_USER_FACES_BUCKET, file)
	);
	const uploadedImages = await Promise.all(uploadPromises);
	face.images.push(...uploadedImages);
	await face.save();

	res.status(200).send(face);
};

const deleteFaceImage = async (req, res) => {
	let imageHash;
	const userId = req.user.id;
	const { faceId, imageId } = req.params;

	const face = await Faces.findById(faceId);
	if (!face) throw NotFoundError('User Face not found');
	if (String(face.userId) !== userId) throw UnauthorizedError('User is not authorized');

	const filteredImages = face.images.filter((v) => {
		if (String(v._id) === imageId) imageHash = v.fileHash;
		return String(v._id) !== imageId;
	});

	if (!imageHash) throw NotFoundError('Image not found');
	await deleteImage(process.env.MINIO_USER_FACES_BUCKET, imageHash);

	face.set({ images: filteredImages });
	await face.save();

	res.status(200).send({ message: 'Image deleted successfully' });
};

const deleteUserFace = async (req, res) => {
	const id = req.params.id;
	const userId = req.user.id;

	const face = await Faces.findById(id);
	if (!face) throw NotFoundError('User Face not found');
	if (String(face.userId) !== userId) throw UnauthorizedError('User is not authorized');

	const deletePromises = face.images.map((image) =>
		deleteImage(process.env.MINIO_USER_FACES_BUCKET, image.fileHash)
	);
	await Promise.all(deletePromises);
	await face.deleteOne();

	res.status(200).send({ message: 'User Face deleted successfully' });
};

module.exports = {
	getUserFaces,
	getFaceById,
	createUserFace,
	uploadFaceImages,
	deleteFaceImage,
	deleteUserFace,
};
