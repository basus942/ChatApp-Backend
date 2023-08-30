const Joi = require("joi");

const authschema = Joi.object({
  email: Joi.string()
    .lowercase()
    .email({
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  username: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().required().min(4),
  name: Joi.string().min(8).max(30).required(),
  image: Joi.string(),
});

const loginAuthSchema = Joi.object({
  email: Joi.string()
    .lowercase()
    .email({
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().required().min(4),
});
const adminAuthSchema = Joi.object({
  email: Joi.string()
    .lowercase()
    .email({
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  name: Joi.string().lowercase().required().max(30),
  password: Joi.string().required().min(4),
});

const AdminLoginAuthSchema = Joi.object({
  email: Joi.string()
    .lowercase()
    .email({
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().required().min(4),
});

//using object because project can have multiple schemas

module.exports = {
  authschema,
  loginAuthSchema,
  adminAuthSchema,
  AdminLoginAuthSchema,
};
