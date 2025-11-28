import { WSClient } from "./ws.js";
//handlers es un objeto que guarda los callbacks de eventos
export const client = new WSClient({
  onOpen: () => {
    console.log("✅ WS conectado");
    // 👇 recién acá enviás el registro
    client.send("register", { username: "stefano" });
  },
  onMessage: (data) => console.log("Mensaje recibido:", data),
  onClose: () => console.log("WS desconectado"),
  onError: (err) => console.error("WS error:", err),
});

// Conectamos apenas se importe
client.connect();
