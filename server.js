const app = express();
app.use();
const db = require("./app/models");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
});
