const User = require("../models/userModel");

const getUserData = (req, res, next) => {
  if (!req.headers["authorization"]) {
    req.userData = null;
    return next();
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(token, process.env.ACCESSTOKEN_KEY, async (err, payload) => {
    if (err) {
      req.userData = null;
      return next();
    }
    const userId = payload.aud;
    const existsInRedis = await client.exists(userId);

    if (!existsInRedis) {
      req.userData = null;
      return next();
    }

    const userData = await User.findById(userId);
    if (!userData) {
      req.userData = null;
      return next();
    }
    req.payload = payload;
    req.userData = userData;
    res.send({ userData });

    next();
  });
};
module.exports = getUserData;
