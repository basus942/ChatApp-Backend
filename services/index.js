const mongoosecon = require("./initMongoDb");
const { rediscon, client } = require("./initRedis");
const jwtAdminServices = require("./JwtAdminServices");
const jwtServices = require("./jwtServices");
const db = () => {
  return new Promise(async (resolve, reject) => {
    await mongoosecon()
      .then(async () => {
        await rediscon()
          .then(async () => {
            resolve();
          })
          .catch(() => {
            reject();
            console.log("Redis not connected");
          });
      })
      .catch(() => {
        reject();
        console.log("Mongodb not connected");
      });
  });
};
module.exports = { db, redisClient: client, jwtServices, jwtAdminServices };
