const Sequelize = require("sequelize");
const database = "delilah";
const user = "root";
const password = "";
const host = "localhost";
const port = 3306;

const sequelize = new Sequelize(
  `mysql://${user}:${password}@${host}:${port}/${database}`
);

const db = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection succededed");
  } catch (err) {
    console.error("Database connection failed", err);
  }
};

db();

module.exports = sequelize;
