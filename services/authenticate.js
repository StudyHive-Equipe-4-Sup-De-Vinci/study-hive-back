const { User, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res, next) {
  const { password, username } = req.body;
  var user;
  user = await User.findOne({ where: { email: username } });
  if (!user) {
    user = await User.findOne({ where: { name: username } });
  }
  if (user === null) {
    return res.status(404).json({ message: "User not found", ok: false });
  }
  const right_password = await bcrypt.compare(password, user.password);
  if (!right_password) {
    return res.status(401).json({ message: "Incorrect password", ok: false });
  }
  const token = jwt.sign({ user: user.cleanUser() }, "secret-key", {
    expiresIn: "1h",
  });

  user.access_token = await bcrypt.hash(token, 8);
  user.save();

  return res.status(200).send({
    message: `User logged in successfully`,
    token: token,
    user: user.cleanUser(),
    ok: true,
  });
}

async function logout(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const token = req.headers["authorization"];
    if (token) {
      jwt.verify(token, "secret-key", async (err, decoded) => {
        const user = await User.findByPk(decoded.user.id);
        user.access_token = null;
        user.save();
        return res.send({ message: "User logged out successfully" });
      });
    } else {
      return res.send({ message: "Already disconnected" });
    }
  } catch (err) {
    transaction.rollback();
    return res.status(400).json({
      message: "Something went wrong",
      error: err.message || err,
      ok: false,
    });
  }
}

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
      error: err.message || err,
      ok: false,
    });
  }
}

module.exports = {
  login,
  logout,
  register,
};
