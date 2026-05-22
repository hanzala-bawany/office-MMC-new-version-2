// backend/socket.js
const { Server } = require("socket.io");

let io;

const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected :", socket.id);

    // ✅ Register screen room (ye new chez add ki he foir room)
    socket.on("REGISTER_SCREEN", (screenId) => {

      // Leave previous room if any
      if (socket.currentScreen) {
        socket.leave(`screen_${socket.currentScreen}`);
        console.log(
          `Socket ${socket.id} left room: screen_${socket.currentScreen} it is ${socket.currentScreen - 1}`,
        );

      }

      // Store current screen and join new room
      socket.currentScreen = screenId;
      socket.join(`screen_${screenId}`);
      console.log(`✅ Socket ${socket.id} joined room: screen_${screenId} it is screen ${socket.currentScreen - 1}`);
      

      // Send acknowledgment
      socket.emit("SCREEN_REGISTERED", { screenId, success: true });
    });

    socket.on("disconnect", () => {
      console.log( "🔴 Socket disconnected:", socket.id, "from screen:", socket.currentScreen, );
    });

  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized! Call initSocket first.");
  }
  return io;
};

module.exports = { initSocket, getIo };
