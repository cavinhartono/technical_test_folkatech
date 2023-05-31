const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.brand = require("../models/brand.model.js")(sequelize, Sequelize);

db.product.belongsToMany(db.brand, {
  through: "product",
  foreignKey: "productId",
  otherKey: "brandId",
});

db.brand.belongsToMany(db.product, {
  through: "user_roles",
  foreignKey: "brandId",
  otherKey: "productId",
});

module.exports = db;
