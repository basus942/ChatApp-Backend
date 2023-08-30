const mongoose = require("mongoose");
require("dotenv").config();

const mongoosecon = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((connection) => {
        console.log("mongoose connected to DB");
        resolve(connection);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = mongoosecon;
