// routes/pronounceRoutes.js

const express = require("express");
const { 
  getConsultantPronounce, 
  manageConsultantPronounce 
} = require("../controllers/pronounceController");

const router = express.Router();

router.get("/",  getConsultantPronounce);
router.post("/", manageConsultantPronounce);

module.exports = router;