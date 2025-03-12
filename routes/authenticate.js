const express = require("express");
const router = express.Router();
const { validateRegister } = require("../middleware/authenticate");
const { register } = require("../services/authenticate");
const { sequelize } = require("../models");

// DB Connection Health check
router.get("/health_check", async (req, res) => {
	try {
    await sequelize.authenticate();
		res.status(200).send({ connected_to_db : true });
  } catch (error) {
		res.status(500).send({
			connected_to_db : false,
			error: error
		});
  }
});

// API d'inscription d'un utilisateur
router.post("/register", validateRegister, register);

module.exports = router;
