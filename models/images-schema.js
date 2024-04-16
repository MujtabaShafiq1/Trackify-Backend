const mongoose = require('mongoose');

module.exports.imagesSchema = new mongoose.Schema(
	{
		fileType: {
			type: String,
			required: true,
		},
		fileHash: {
			type: String,
			required: true,
		},
		fileName: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);
