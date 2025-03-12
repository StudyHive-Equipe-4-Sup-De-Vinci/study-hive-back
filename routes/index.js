const userRoutes = require("./users");
const authenticateRoutes = require("./authenticate");
const cors = require("cors");
const corsOptions = {
  origin: "*",
};

function initRoutes(app) {
  app.use(cors(corsOptions));
  app.use("/", authenticateRoutes);
  app.use("/api/users", userRoutes);
}

module.exports = initRoutes;
