const authenticateRoutes = require("./authenticate");
const cors = require("cors");
const corsOptions = {
  origin: "*",
};

function initRoutes(app) {
  app.use(cors(corsOptions));
  app.use("/", authenticateRoutes);
}

module.exports = initRoutes;
