const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { redisClient } = require("../services/index");
require("dotenv").config;
module.exports = {
  getLoggedinUserData: async (req, res, next) => {
    if (!req.headers["authorization"]) {
      res.send({ userData: null });
      return;
    }
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    jwt.verify(token, process.env.ACCESSTOKEN_KEY, async (err, payload) => {
      if (err) {
        res.send({ userData: null });
        return;
      }
      const userId = payload.aud;
      const existsInRedis = await redisClient.exists(userId);

      if (!existsInRedis) {
        res.send({ userData: null });
        return;
      }
      try {
        const userData = await User.findById(userId);
        const { password, ...others } = userData._doc;
        res.send({ userData: others });
      } catch (error) {
        res.send({ userData: null });
        next();
      }
    });
  },
  getUserInfo: async (req, res, next) => {
    try {
      const userData = await User.findById(req.params.userId);
      const { password, ...others } = userData._doc;
      res.status(200).json(others);
    } catch (error) {
      next(error);
    }
  },
};
