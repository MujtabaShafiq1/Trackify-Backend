const Joi = require('../joi-instance');

const baggageSchema = Joi.object({
	color: Joi.string().min(3).max(32).required(),
	category: Joi.string().min(3).max(20).required(),
	brand: Joi.string().min(3).max(20).required(),
});

module.exports = {
	baggageSchema,
};
