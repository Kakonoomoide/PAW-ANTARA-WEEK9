require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres", // bisa di rubah ke mysql jika kalian menggunakan mysql (mysql || postgress)
    logging: false, // set true kalo mau liat query SQL di console
  },
);

module.exports = sequelize;
