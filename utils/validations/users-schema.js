const Joi = require("../joi-instance");

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(32).required(),
  password: Joi.string().min(8).max(20).required(),
});

const updateSchema = Joi.object({
  username: Joi.string().min(3).max(32).required(),
  firstName: Joi.string().min(3).max(20).required(),
  lastName: Joi.string().min(3).max(20).required(),
  contactNumber: Joi.string().required(),
  position: Joi.string().required(),
});

const signupSchema = updateSchema.keys({
  password: Joi.string().min(8).max(20).required(),
});

module.exports = {
  loginSchema,
  signupSchema,
  updateSchema,
};
