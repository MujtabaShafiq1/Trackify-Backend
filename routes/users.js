const router = require('express').Router();

// controller
const {
	userDetails,
	signup,
	login,
	updateUser,
	approveUser,
	grantAdmin,
} = require('../controllers/users');

// middlewares
const { validateToken } = require('../middlewares/validate-token');
const { validateRequest } = require('../middlewares/validate-request');
const { validateAdmin } = require('../middlewares/validate-admin');

// validation
const { loginSchema, signupSchema, updateSchema } = require('../utils/validations/users-schema');

// routes
router.get('/details', validateToken, userDetails);
router.post('/login', validateRequest(loginSchema), login);
router.post('/signup', validateRequest(signupSchema), signup);
router.put('/', [validateToken, validateRequest(updateSchema)], updateUser);
router.patch('/grant-admin/:id', [validateToken, validateAdmin], grantAdmin);
router.patch('/approve/:id', [validateToken, validateAdmin], approveUser);

module.exports = router;
