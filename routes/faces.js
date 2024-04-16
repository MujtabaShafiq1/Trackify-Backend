const router = require('express').Router();
const multer = require('../configs/multerConfig')();

// controller
const {
	getUserFaces,
	getFaceById,
	createUserFace,
	uploadFaceImages,
	deleteFaceImage,
  deleteUserFace,
} = require('../controllers/faces');

// middlewares
const { validateToken } = require('../middlewares/validate-token');
const { validateImage } = require('../middlewares/validate-image');

// routes
router.get('/user/:id', getUserFaces);
router.get('/:id', getFaceById);
router.post('/', [validateToken, multer.array('images', 5), validateImage], createUserFace);
router.patch('/:id', [validateToken, multer.array('images', 5), validateImage], uploadFaceImages);
router.delete('/:faceId/:imageId', [validateToken], deleteFaceImage);
router.delete('/:id', [validateToken], deleteUserFace);

module.exports = router;
