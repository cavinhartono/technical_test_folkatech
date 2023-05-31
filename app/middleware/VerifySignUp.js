const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (user) {
      return res.status(400).send({
        message: "Gagal! Username Anda sudah terpakai!",
      });
    }

    user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      return res.status(400).send({
        message: "Gagal! Email Anda sudah terpakai!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      message: "Masukan Email dan Password dengan bener!",
    });
  }
};

const VerifySignUp = checkDuplicateUsernameOrEmail;

module.exports = VerifySignUp;
