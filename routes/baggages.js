const router = require('express').Router();
const multer = require('../configs/multerConfig')();

// controller
const {
	getUserBaggages,
	getBaggageById,
	createBaggage,
	uploadBaggageImages,
	deleteBaggageImage,
	deleteBaggage,
} = require('../controllers/baggages');

// middlewares
const { validateToken } = require('../middlewares/validate-token');
const { validateImage } = require('../middlewares/validate-image');
const { validateRequest } = require('../middlewares/validate-request');

// validation
const { baggageSchema } = require('../utils/validations/baggages-schema');

// routes
router.get('/user/:id', getUserBaggages);
router.get('/:id', getBaggageById);
router.post(
	'/',
	[validateToken, multer.array('images', 5), validateImage, validateRequest(baggageSchema)],
	createBaggage
);
router.patch(
	'/:id',
	[validateToken, multer.array('images', 5), validateImage, validateRequest(baggageSchema)],
	uploadBaggageImages
);
router.delete('/:baggageId/:imageId', [validateToken], deleteBaggageImage);
router.delete('/:id', [validateToken], deleteBaggage);

module.exports = router;
