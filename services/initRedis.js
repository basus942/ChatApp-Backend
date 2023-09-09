require("dotenv").config();
const { createClient } = require("redis");

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
  },
});

const rediscon = () => {
  return new Promise((resolve, reject) => {
    client
      .connect()
      .then((connection) => {
        console.log("Client is connected to Redis");
        resolve(connection);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = { client, rediscon };
