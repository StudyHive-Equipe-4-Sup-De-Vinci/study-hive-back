const express = require("express");
const router = express.Router();
const { sequelize } = require("../models");
const { login, logout } = require("../services/authenticate");
const { validateLogin, authMiddleware } = require("../middleware/authenticate");

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

router.get("/protected", authMiddleware, (req, res) => {
	res.status(200).send({ authenticated: true });
});

// API de connexion d'un utilisateur
router.post("/login", validateLogin, login);

// API de déconnexion d'un utilisateur
router.get("/logout", authMiddleware, logout);

module.exports = router;
