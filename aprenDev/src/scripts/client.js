import { WSClient } from "./ws.js";

export const client = new WSClient({
  onOpen: () => console.log("WS conectado"),
  onMessage: (data) => console.log("Mensaje recibido:", data),
  onClose: () => console.log("WS desconectado"),
  onError: (err) => console.error("WS error:", err),
});

// Conectamos apenas se importe
client.connect();
