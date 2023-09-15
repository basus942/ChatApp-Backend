const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { db, jwtServices, jwtAdminServices } = require("./services");
const authRoutes = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const conversationRoute = require("./routes/conversationRoute");
const messageRoute = require("./routes/messageRoute");
const paymentRoute = require("./routes/paymentRoute");

const { getLoggedinUserData, getUserInfo } = require("./middleware/users");
const { notFound, internalServerError } = require("./middleware/errors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/admin", adminRoute);
app.get("/home", jwtServices.verifyAccessToken, async (req, res, next) => {
  res.json({ message: "Hello from ChatApp" });
});

app.get(
  "/admin",
  jwtAdminServices.verifyAdminAccessToken,
  async (req, res, next) => {
    res.json({ message: "Admin Dashboard" });
  }
);

app.get("/user/profile", getLoggedinUserData);
app.get("/user/:userId", getUserInfo);

app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute);

app.use("/payment", paymentRoute);

//errorHandle
app.use(notFound);
app.use(internalServerError);

db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} `);
    });
  })
  .catch(() => {
    console.log("db cannot be connected");
  });
