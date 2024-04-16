const mongoose = require('mongoose');
const { imagesSchema } = require('./images-schema');

const baggagesSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Users',
		},
		category: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		images: [imagesSchema],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Baggages', baggagesSchema);
