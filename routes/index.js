const authenticateRoutes = require("./authenticate");
const postRoutes = require("./posts");
const cors = require("cors");
const corsOptions = {
  origin: "*",
};

function initRoutes(app) {
  app.use(cors(corsOptions));
  app.use("/", authenticateRoutes);
  app.use("/api/posts", postRoutes);
}

module.exports = initRoutes;
