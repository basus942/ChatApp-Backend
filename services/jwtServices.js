const jwt = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();

const { client } = require("./initRedis");

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESSTOKEN_KEY;
    const options = {
      expiresIn: "1h",
      issuer: "www.chatAPP.com",
      audience: userId,
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
const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      // id: userId + String(Date.now())
    };
    const secret = process.env.REFRESHTOKEN_KEY;
    const options = {
      expiresIn: "1y",
      issuer: "www.chatAPP.com",
      audience: userId,
    };
    jwt.sign(payload, secret, options, async (err, token) => {
      if (err) {
        console.error("Error signing jwt:", err);
        reject(createError.InternalServerError());
        return;
      }
      await client.SET(userId, token, { EX: 365 * 24 * 60 * 60 });

      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(token, process.env.ACCESSTOKEN_KEY, async (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    const userId = payload.aud;
    const existsInRedis = await client.exists(userId);

    if (!existsInRedis) {
      return next(createError.Unauthorized("Token not found in Redis"));
    }
    req.payload = payload;
    req.userId = userId;

    next();
  });
};
const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESHTOKEN_KEY,
      async (err, payload) => {
        if (err) return reject(createError.InternalServerError());
        const userId = payload.aud;

        const result = await client.get(userId);
        if (result === refreshToken) {
          resolve(userId);
        } else {
          reject(createError.Unauthorized());
        }
      }
    );
  });
};

module.exports = {
  signAccessToken: signAccessToken,
  verifyAccessToken: verifyAccessToken,
  signRefreshToken: signRefreshToken,
  verifyRefreshToken: verifyRefreshToken,
};
