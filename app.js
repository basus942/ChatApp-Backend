const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { db, jwtServices, jwtAdminServices } = require("./services");
const authRoutes = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const conversationRoute = require("./routes/conversationRoute");
const messageRoute = require("./routes/messageRoute");
<<<<<<< HEAD
const paymentRoute = require("./routes/paymentRoute");
=======
>>>>>>> 8d1d1bada8fdb8a1f0185d8bbebebdbfb722a1ab

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

<<<<<<< HEAD
app.use("/payment", paymentRoute);

=======
>>>>>>> 8d1d1bada8fdb8a1f0185d8bbebebdbfb722a1ab
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
