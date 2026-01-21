import { WSClient } from "./ws.js";

export const client = new WSClient({
  onOpen: () => {
    console.log("✅ Socket.IO conectado");
    client.send("register", { username: "stefano" });
  },
  onMessage: ({ event, data }) => {
    console.log(`📩 Evento recibido (${event}):`, data);
  },
  onClose: (info) => console.log("❌ Desconectado:", info),
  onError: (err) => console.error("⚠️ Error Socket:", err),
});

client.connect();
