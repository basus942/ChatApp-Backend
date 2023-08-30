const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { db, jwtServices, jwtAdminServices } = require("./services");
const authRoutes = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");

const getUserData = require("./middleware/users");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("*", getUserData, async (req, res) => {
  res.json({ userData: req.userData });
});
app.use("/auth", authRoutes);
app.use("/admin", adminRoute);
app.get("/", jwtServices.verifyAccessToken, async (req, res, next) => {
  res.json({ message: "Hello from ChatApp" });
});

app.get(
  "/admin",
  jwtAdminServices.verifyAdminAccessToken,
  async (req, res, next) => {
    res.json({ message: "Admin Dashboard" });
  }
);

app.use(async (req, res, next) => {
  const error = new Error("Not Found ");
  error.status = 404;
  next(error);
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} `);
    });
  })
  .catch(() => {
    console.log("db cannot be connected");
  });
