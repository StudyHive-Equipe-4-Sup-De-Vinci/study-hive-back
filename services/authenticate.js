const { User, sequelize } = require("../models");
const bcrypt = require("bcryptjs");

async function register(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    var user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).send({
        message: `User email already exists`,
        ok: false,
      });
    }
    user = await User.findOne({ where: { name } });
    if (user) {
      return res.status(400).send({
        message: `Username already exists`,
        ok: false,
      });
    }
    const new_user = await User.create(
      {
        name,
        email,
        password: hashedPassword,
        is_admin: false,
        registration_date: new Date(),
        access_token: null,
        profile_picture_link: null,
      },
      { transaction }
    );
    transaction.commit();
    return res.status(201).send({
      message: `User registered successfully`,
      user: new_user,
      ok: true,
    });
  } catch (err) {
    transaction.rollback();
    return res.status(400).json({
      message: "Something went wrong",
      error: err,
      ok: false,
    });
  }
}

module.exports = {
  register,
};
