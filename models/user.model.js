module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  });
  return User;
};
