const mongoose = require('mongoose');
const { imagesSchema } = require('./images-schema');

const facesSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Users',
		},
		images: [imagesSchema],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Faces', facesSchema);
