const Joi = require("../joi-instance")

const configSchema = Joi.object({
  PORT: Joi.string().required(),
  JWT_KEY: Joi.string().required(),
});

module.exports = {
  configSchema,
};
