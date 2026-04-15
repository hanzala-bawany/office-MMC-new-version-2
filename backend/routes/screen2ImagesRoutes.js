const express = require("express");
const { getScreen2Images, manageScreen2Images } = require("../controllers/screen2ImagesController.js");
const { dynamicMiddleware } = require("../middleware/uploadMiddleware.js");

const router = express.Router();

router.post("/manage", dynamicMiddleware, manageScreen2Images);

router.get("/manage", getScreen2Images);

module.exports = router;
