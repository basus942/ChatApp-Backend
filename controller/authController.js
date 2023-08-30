const createError = require("http-errors");
require("dotenv").config();
const User = require("../models/userModel");

const { jwtServices, redisClient } = require("../services");

const {
  authschema,
  loginAuthSchema,
} = require("../services/validationSchemaJoi");

module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await authschema.validateAsync(req.body);
      const { email, username } = result;
      const doesExistEmail = await User.findOne({ email: result.email });
      const doesExistUserName = await User.findOne({
        username: result.username,
      });
      if (doesExistEmail) {
        throw createError.Conflict(`${email} already exists`);
      }
      if (doesExistUserName) {
        throw createError.Conflict(`${username} already exists`);
      }

      const user = new User(result);
      const saveUser = await user.save();
      const accessToken = await jwtServices.signAccessToken(saveUser.id);
      const refreshToken = await jwtServices.signRefreshToken(saveUser.id);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await loginAuthSchema.validateAsync(req.body);

      const checkUser = await User.findOne({ email: result.email });

      if (!checkUser)
        throw createError.NotFound(`${result.email} does not exists`);

      const isMatch = await checkUser.isValidPass(result.password);
      if (!isMatch)
        throw createError.Unauthorized("Username or Password is not Valid");
      const accessToken = await jwtServices.signAccessToken(checkUser.id);
      const refreshToken = await jwtServices.signRefreshToken(checkUser.id);

      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) {
        return next(createError.BadRequest("Invalid UserName or Password"));
      }

      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return createError.BadRequest();
      const userId = await jwtServices.verifyRefreshToken(refreshToken);

      const newaccessToken = await jwtServices.signAccessToken(userId);
      const newrefreshToken = await jwtServices.signRefreshToken(userId);
      res.send({ accessToken: newaccessToken, refreshToken: newrefreshToken });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshtoken } = req.headers;
      if (!refreshtoken) throw createError.BadRequest();
      const userId = await jwtServices.verifyRefreshToken(refreshtoken);
      redisClient.del(userId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};
