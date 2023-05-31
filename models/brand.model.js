module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define("brands", {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
  });
  return Brand;
};
