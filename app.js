require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const { sequelize } = require("./models");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const viewRoutes = require("./routes/view.routes");

const app = express();

// setup EJS sebagai view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-default",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
      httpOnly: true,
    },
  }),
);

// routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/", viewRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Koneksi database berhasil");

    // sync model ke db (bikin tabel kalo belum ada)
    await sequelize.sync();
    console.log("Sync model selesai");

    app.listen(PORT, () => {
      console.log(`Server jalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Gagal konek ke database:", err.message);
  }
}

start();
