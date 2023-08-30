const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const {
  adminRegister,
  adminLogin,
  adminRefreshToken,
  adminLogout,
} = require("../controller/adminAuthController");

router.get("/users", async (req, res, next) => {
  try {
    const allUsers = await User.find();

    res.send({ users: allUsers });
  } catch (error) {
    console.log(error);
  }
});
router.post("/register", adminRegister);
router.post("/login", adminLogin);

router.post("/refreshtoken", adminRefreshToken);
router.delete("/logout", adminLogout);

module.exports = router;
