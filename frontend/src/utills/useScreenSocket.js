import { useEffect, useRef, useState } from "react";
import { socket } from "../socket/socket";

export const useScreenSocket = (screenId, onQueueUpdate) => {
  
  const [isConnected, setIsConnected] = useState(false);
  const isRegistered = useRef(false);
  const callbackRef = useRef(onQueueUpdate); // ✅ ref mein store karo

  // Always latest callback rakho
  useEffect(() => {
    callbackRef.current = onQueueUpdate;
  }, [onQueueUpdate]);

  useEffect(() => {
    
    if (!screenId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log(`Socket connected for screen id ${screenId}`);
      setIsConnected(true);
      if (!isRegistered.current) {
        socket.emit("REGISTER_SCREEN", screenId);
        isRegistered.current = true;
      }
    };

    const onDisconnect = () => {
      console.log(`Socket disconnected for screen id ${screenId}`);
      setIsConnected(false);
      isRegistered.current = false;
    };

    const onScreenRegistered = (data) => {
      console.log(`Screen id ${data.screenId} registered successfully`);
    };

    // ✅ Stable wrapper — ye kabhi nahi badlega
    const onQueueHandler = (payload) => {
      callbackRef.current(payload);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("SCREEN_REGISTERED", onScreenRegistered);
    socket.on("QUEUE_UPDATED", onQueueHandler); // ✅ stable function

    if (socket.connected && !isRegistered.current) {
      socket.emit("REGISTER_SCREEN", screenId);
      isRegistered.current = true;
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("SCREEN_REGISTERED", onScreenRegistered);
      socket.off("QUEUE_UPDATED", onQueueHandler);
      isRegistered.current = false;
    };
  }, [screenId]); // ✅ onQueueUpdate dependency hata di

  return { isConnected };
};
