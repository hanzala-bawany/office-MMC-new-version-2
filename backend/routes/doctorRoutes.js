const express = require("express");
const { manageDoctor, getDoctors } = require("../controllers/doctorController.js");
const { dynamicMiddleware } = require("../middleware/uploadMiddleware.js");

const router = express.Router();

router.post("/manage", dynamicMiddleware, manageDoctor);

router.get("/list", getDoctors);


module.exports = router;
