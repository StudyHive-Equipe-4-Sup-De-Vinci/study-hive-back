const userRoutes = require("./users");
const authenticationRoutes = require("./authenticate");
const cors = require("cors");
const corsOptions = {
  origin: "*",
};

function initRoutes(app) {
  app.use(cors(corsOptions));
  app.use("/", authenticationRoutes);
  app.use("/api/users", userRoutes);
}

module.exports = initRoutes;
