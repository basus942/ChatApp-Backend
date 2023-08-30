const jwt = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();

const { client } = require("./initRedis");

const signAdminAccessToken = (adminId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ADMIN_ACCESSTOKEN_KEY;
    const options = {
      expiresIn: "1h",
      issuer: "www.chatAPP.com",
      audience: adminId,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(createError.InternalServerError());
        return err;
      } else {
        resolve(token);
      }
    });
  });
};
const signAdminRefreshToken = (adminId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ADMIN_REFRESHTOKEN_KEY;
    const options = {
      expiresIn: "1h",
      issuer: "www.chatAPP.com",
      audience: adminId,
    };
    jwt.sign(payload, secret, options, async (err, token) => {
      if (err) {
        reject(createError.InternalServerError());
        return err;
      } else {
        await client.SET(adminId, token, { EX: 365 * 24 * 60 * 60 });
        resolve(token);
      }
    });
  });
};
const verifyAdminAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(token, process.env.ADMIN_ACCESSTOKEN_KEY, async (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    const adminId = payload.aud;
    const existsInRedis = await client.exists(adminId);

    if (!existsInRedis) {
      return next(createError.Unauthorized("Token not found in Redis"));
    }
    req.payload = payload;

    next();
  });
};

const verifyAdminRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.ADMIN_REFRESHTOKEN_KEY,
      async (err, payload) => {
        if (err) return reject(createError.InternalServerError());
        const adminId = payload.aud;

        const result = await client.get(adminId);
        if (result === refreshToken) {
          resolve(adminId);
        } else {
          reject(createError.Unauthorized());
        }
      }
    );
  });
};
module.exports = {
  signAdminAccessToken,
  signAdminRefreshToken,
  verifyAdminRefreshToken,
  verifyAdminAccessToken,
};
