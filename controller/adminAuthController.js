const createError = require("http-errors");
const {
  adminAuthSchema,
  AdminLoginAuthSchema,
} = require("../services/validationSchemaJoi");
const Admin = require("../models/adminModel");
const createHttpError = require("http-errors");
const { jwtAdminServices, redisClient } = require("../services/index");
module.exports = {
  adminRegister: async (req, res, next) => {
    try {
      const result = await adminAuthSchema.validateAsync(req.body);

      const { email, username } = result;

      const doesExistEmail = await Admin.findOne({ email: result.email });
      const doesExistUserName = await Admin.findOne({
        username: result.username,
      });
      if (doesExistEmail) {
        throw createHttpError.Conflict(`${email} already exists`);
      }
      if (doesExistUserName) {
        throw createError.Conflict(`${username} already exists`);
      }
      const admin = new Admin(result);
      const savedAdmin = await admin.save();

      const adminAccessToken = await jwtAdminServices.signAdminAccessToken(
        savedAdmin.id
      );
      const adminRefreshToken = await jwtAdminServices.signAdminRefreshToken(
        savedAdmin.id
      );
      res.send({ adminAccessToken, adminRefreshToken });
    } catch (error) {
      next(error);
    }
  },
  adminLogin: async (req, res, next) => {
    try {
      const result = await AdminLoginAuthSchema.validateAsync(req.body);

      const checkUser = await Admin.findOne({ email: result.email });
      if (!checkUser) {
        throw createError.NotFound(`${result.email} does not exists`);
      }
      const isMatch = await checkUser.isValidPass(result.password);
      if (!isMatch) {
        throw createError.Unauthorized("Username or Password is not Valid");
      }
      const adminAccessToken = await jwtAdminServices.signAdminAccessToken(
        checkUser.id
      );
      const adminRefreshToken = await jwtAdminServices.signAdminRefreshToken(
        checkUser.id
      );
      res.send({ adminAccessToken, adminRefreshToken });
    } catch (error) {
      next(error);
    }
  },
  adminRefreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return createError.BadRequest();
      }
      const userId = jwtAdminServices.verifyAdminRefreshToken(refreshToken);
      const newaccessToken = jwtAdminServices.signAdminAccessToken(userId);
      const newrefreshToken = jwtAdminServices.signAdminRefreshToken(userId);
      res.send({
        adminAccessToken: newaccessToken,
        adminRefreshToken: newrefreshToken,
      });
    } catch (err) {
      console.log(err);
    }
  },
  adminLogout: async (req, res, next) => {
    try {
      const { refreshtoken } = req.headers;
      if (!refreshtoken) throw createError.BadRequest();
      const userId = await jwtAdminServices.verifyAdminRefreshToken(
        refreshtoken
      );
      redisClient.del(userId);
      res.sendStatus(204);
    } catch (error) {}
  },
};
