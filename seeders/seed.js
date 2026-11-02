require("dotenv").config();
const bcrypt = require("bcrypt");
const { sequelize, User, Product } = require("../models");

const SALT_ROUNDS = 10;

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Koneksi database berhasil");

    // pastiin tabel udah ada
    await sequelize.sync();

    // password plain buat semua dummy user: "password123"
    const hashedPassword = await bcrypt.hash("password123", SALT_ROUNDS);

    // upsert biar aman kalo seed dijalanin berkali-kali (gak bikin duplikat)
    const [user1] = await User.findOrCreate({
      where: { username: "rizki" },
      defaults: { password: hashedPassword },
    });

    const [user2] = await User.findOrCreate({
      where: { username: "budi" },
      defaults: { password: hashedPassword },
    });

    console.log("User dummy siap:", user1.username, "&", user2.username);

    // bikin product dummy, tapi cek dulu biar gak numpuk kalo diulang-ulang
    const existingProducts = await Product.count({ where: { user_id: user1.id } });

    if (existingProducts === 0) {
      await Product.bulkCreate([
        {
          name: "Laptop Gaming Asus ROG",
          description: "Laptop gaming performa tinggi dengan GPU RTX 4060",
          price: 18500000,
          stock: 5,
          category: "Elektronik",
          user_id: user1.id,
        },
        {
          name: "Sepatu Nike Air Max",
          description: "Sepatu lari premium dengan teknologi Air cushion",
          price: 1250000,
          stock: 20,
          category: "Fashion",
          user_id: user1.id,
        },
        {
          name: "Kopi Arabika Flores",
          description: "Biji kopi arabika premium dari dataran tinggi Flores",
          price: 85000,
          stock: 0,
          category: "Makanan & Minuman",
          user_id: user1.id,
        },
        {
          name: "Headphone Sony WH-1000XM5",
          description: "Headphone noise cancelling terbaik di kelasnya",
          price: 4200000,
          stock: 8,
          category: "Elektronik",
          user_id: user2.id,
        },
        {
          name: "Tas Ransel Outdoor",
          description: "Tas ransel tahan air kapasitas 45L untuk hiking",
          price: 650000,
          stock: 15,
          category: "Outdoor",
          user_id: user2.id,
        },
      ]);
      console.log("Product dummy berhasil ditambahin");
    } else {
      console.log("Product dummy udah ada, skip supaya gak dobel");
    }

    console.log("\nSeeding selesai ✅");
    console.log("Login pake salah satu ini:");
    console.log("  username: rizki  | password: password123");
    console.log("  username: budi   | password: password123");

    process.exit(0);
  } catch (err) {
    console.error("Gagal seeding:", err.message);
    process.exit(1);
  }
}

seed();
