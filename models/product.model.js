module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("users", {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    detail: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
  });
  return Product;
};
