const express = require("express");
require("./database.js");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes.js");
const facultyRoutes = require("./routes/facultyRoutes.js");
const screen2ImagesRoutes = require("./routes/screen2ImagesRoutes.js");
const screen3ImagesRoutes = require("./routes/screen3ImagesRoutes.js");
const screen4ImagesRoutes = require("./routes/screen4ImagesRoutes.js");
const screen1ImagesRoutes = require("./routes/screen1ImagesRoutes.js");
const doctorRoutes = require("./routes/doctorRoutes.js");
const screenRoutes = require("./routes/screenRoutes.js");
const headlineRoutes = require("./routes/headlinesRoutes.js");


const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Default route
app.get("/", (req, res) => {
  res.send("Hello Server  Respose  he .");
});

// Routes
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/screen2images", screen2ImagesRoutes);
app.use("/api/screen3images", screen3ImagesRoutes);
app.use("/api/screen4images", screen4ImagesRoutes);
app.use("/api/screen1images", screen1ImagesRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/screen", screenRoutes);
app.use("/api/headline", headlineRoutes);


if(process.env.MODE == "DEVELOPMENT") {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(` Server is running on http://localhost:${PORT}`);
  });
}
else{
  module.exports = app;
}
  