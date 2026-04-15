const multer = require("multer");
const express = require("express");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Dynamic middleware for handling both JSON and FormData
const dynamicMiddleware = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  
  if (contentType.includes("multipart/form-data")) {
    
    upload.single("image")(req, res, (err) => {

      if (err) {
        return res.status(400).json({
          success: false,
          message: "File upload failed",
          error: err.message
        });
      }

      next();

    });
  } else {

    express.json()(req, res, next);

  }
};

module.exports = { dynamicMiddleware };
