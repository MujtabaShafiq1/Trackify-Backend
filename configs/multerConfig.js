const multer = require('multer');

module.exports = function () {
	const storage = multer.memoryStorage();
	return multer({ storage: storage });
};
