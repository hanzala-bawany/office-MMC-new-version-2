const express = require("express");
require("./database.js");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const authRoutes = require("./routes/authRoutes.js");
const facultyRoutes = require("./routes/facultyRoutes.js");
const screen2ImagesRoutes = require("./routes/screen2ImagesRoutes.js");
const screen3ImagesRoutes = require("./routes/screen3ImagesRoutes.js");
const screen4ImagesRoutes = require("./routes/screen4ImagesRoutes.js");
const screen1ImagesRoutes = require("./routes/screen1ImagesRoutes.js");
const doctorRoutes = require("./routes/doctorRoutes.js");
const screenRoutes = require("./routes/screenRoutes.js");
const headlineRoutes = require("./routes/headlinesRoutes.js");
const opdRoutes = require("./routes/opd.Routes.js");
const poolPromise = require("./database.js");

const app = express();
const PORT = 3000;

// 👇 HTTP server
const server = http.createServer(app);

// 👇 Socket server
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });
});

app.set("io", io);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// Default route
app.get("/", (req, res) => {
  res.send("Hello Server Response he.");
});

// Routes
app.use("/assets", express.static(path.join(process.cwd(), "assets")));
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/screen2images", screen2ImagesRoutes);
app.use("/api/screen3images", screen3ImagesRoutes);
app.use("/api/screen4images", screen4ImagesRoutes);
app.use("/api/screen1images", screen1ImagesRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/screen", screenRoutes);
app.use("/api/headline", headlineRoutes);
app.use("/api/opd", opdRoutes);

let lastCreatedTime = null;

async function startOpdWatcher(io) {
  setInterval(async () => {
    let connection;

    try {
      const pool = await poolPromise;
      connection = await pool.getConnection();

      const result = await connection.execute(
        `SELECT MAX(createdtime) FROM hms.opdreceipt`,
      );

      const currentValue = result.rows[0][0];

      if (
        lastCreatedTime !== null &&
        currentValue &&
        new Date(currentValue).getTime() !== new Date(lastCreatedTime).getTime()
      ) {
        io.emit("opdUpdated", {
          message: "New OPD Receipt Added",
          time: new Date(),
        });
      }

      lastCreatedTime = currentValue;
    } catch (err) {
      console.error("Watcher Error:", err);
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }, 5000);
}

// ✅ Server Start
server.listen(PORT, async () => {
  await startOpdWatcher(io);
  console.log(`🚀 Server running on ${PORT}`);
});

module.exports = app;










// const express = require("express");
// require("./database.js");
// const cors = require("cors");
// const path = require("path");
// const http = require("http");
// const { Server } = require("socket.io");

// const authRoutes = require("./routes/authRoutes.js");
// const facultyRoutes = require("./routes/facultyRoutes.js");
// const screen2ImagesRoutes = require("./routes/screen2ImagesRoutes.js");
// const screen3ImagesRoutes = require("./routes/screen3ImagesRoutes.js");
// const screen4ImagesRoutes = require("./routes/screen4ImagesRoutes.js");
// const screen1ImagesRoutes = require("./routes/screen1ImagesRoutes.js");
// const doctorRoutes = require("./routes/doctorRoutes.js");
// const screenRoutes = require("./routes/screenRoutes.js");
// const headlineRoutes = require("./routes/headlinesRoutes.js");
// const opdRoutes = require("./routes/opd.Routes.js")


// const app = express();
// const PORT = 3000;

// // 👇 HTTP server
// const server = http.createServer(app);

// // 👇 Socket server
// const io = new Server(server, {
//   cors: { origin: "*" }
// });

// io.on("connection", (socket) => {
//   console.log("🟢 Socket connected:", socket.id);
//   socket.on("disconnect", () => {
//     console.log("🔴 Socket disconnected");
//   });
// });

// // 👇 make io available in APIs
// app.set("io", io);

// // Middleware
// app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

// // Default route
// app.get("/", (req, res) => {
//   res.send("Hello Server  Respose  he .");
// });

// // Routes
// // index.js
// app.use("/assets", express.static(path.join(process.cwd(), "assets")));
// app.use("/api/auth", authRoutes);
// app.use("/api/faculty", facultyRoutes);
// app.use("/api/screen2images", screen2ImagesRoutes);
// app.use("/api/screen3images", screen3ImagesRoutes);
// app.use("/api/screen4images", screen4ImagesRoutes);
// app.use("/api/screen1images", screen1ImagesRoutes);
// app.use("/api/doctor", doctorRoutes);
// app.use("/api/screen", screenRoutes);
// app.use("/api/headline", headlineRoutes);
// app.use("/api/opd", opdRoutes)


// server.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running http://localhost:${PORT}`);
// });
//   module.exports = app;

