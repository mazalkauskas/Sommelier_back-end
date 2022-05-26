const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().lowercase().trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().trim().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().trim().required(),
});

const resetPasswordSchema = Joi.object({
  oldPassword: Joi.string().trim().required(),
  newPassword: Joi.string().trim().required(),
});

const winePostSchema = Joi.object({
  title: Joi.string().lowercase().trim().required(),
  region: Joi.string().lowercase().trim().required(),
  year: Joi.number().required(),
});

const collectionPostSchema = Joi.object({
  wine_id: Joi.number().required(),
  quantity: Joi.number().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  winePostSchema,
  collectionPostSchema,
};
