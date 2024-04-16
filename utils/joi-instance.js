const _ = require('joi');

const Joi = _.defaults((schema) => {
	return schema.options({
		abortEarly: false,
		errors: {
			wrap: {
				label: false,
			},
		},
	});
});

Joi.objectId = require('joi-objectid')(_);
module.exports = Joi;
