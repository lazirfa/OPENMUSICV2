const Joi = require('joi');

const Album_PayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required()
});
module.exports = { Album_PayloadSchema };
