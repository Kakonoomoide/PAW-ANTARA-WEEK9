const bcrypt = require("bcrypt");
const { User } = require("../models");

const SALT_ROUNDS = 10;

// GET /auth/register -> form register
function registerForm(req, res) {
  if (req.session.userId) return res.redirect("/products");
  return res.render("auth/register", { title: "Register", error: null, old: {} });
}

// GET /auth/login -> form login
function loginForm(req, res) {
  if (req.session.userId) return res.redirect("/products");
  return res.render("auth/login", {
    title: "Login",
    error: null,
    old: {},
    success: req.query.success || null,
  });
}

// POST /auth/register
async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render("auth/register", {
        title: "Register",
        error: "Username dan password wajib diisi",
        old: req.body,
      });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.render("auth/register", {
        title: "Register",
        error: "Username sudah dipakai",
        old: req.body,
      });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({ username, password: hashed });

    return res.redirect("/auth/login?success=Registrasi berhasil, silakan login");
  } catch (err) {
    return res.render("auth/register", {
      title: "Register",
      error: err.message,
      old: req.body,
    });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render("auth/login", {
        title: "Login",
        error: "Username dan password wajib diisi",
        old: req.body,
      });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        error: "Username atau password salah",
        old: req.body,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("auth/login", {
        title: "Login",
        error: "Username atau password salah",
        old: req.body,
      });
    }

    // simpan session
    req.session.userId = user.id;
    req.session.username = user.username;

    return res.redirect("/products");
  } catch (err) {
    return res.render("auth/login", {
      title: "Login",
      error: err.message,
      old: req.body,
    });
  }
}

// POST /auth/logout
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/products?error=Gagal logout");
    }
    res.clearCookie("connect.sid");
    return res.redirect("/auth/login");
  });
}

module.exports = { registerForm, loginForm, register, login, logout };
