const express = require("express");
const router = express.Router();
const {
  registerForm,
  loginForm,
  register,
  login,
  logout,
} = require("../controllers/auth.controller");

router.get("/register", registerForm);
router.get("/login", loginForm);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
