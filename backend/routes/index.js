const express = require("express");
const statisticsRoutes = require("./statisticsRoutes");
const settingsRoutes = require("./settingsRoutes");
const managementRoutes = require("./managementRoutes");
// const { verifyToken } = require("../middleware/authMiddleWare");
const routes = express.Router();

// routes.use(verifyToken);

routes.use("/statisticsRoutes", statisticsRoutes);
routes.use("/settings", settingsRoutes);
routes.use("/management", managementRoutes);



module.exports = routes;
