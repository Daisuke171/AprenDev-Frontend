import { io } from "socket.io-client";

export class WSClient {
  constructor({ onOpen, onMessage, onClose, onError }) {
    this.onOpen = onOpen;
    this.onMessage = onMessage;
    this.onClose = onClose;
    this.onError = onError;
    this.socket = null;
  }

  connect() {
    // cambia el WebSocket por socket.io
    this.socket = io("http://localhost:3010", {
      transports: ["websocket"],
      reconnection: true,
    });

    this.socket.on("connect", () => {
      console.log("Socket.ID:", this.socket.id);
      this.onOpen?.();
    });

    this.socket.onAny((event, data) => {
      // esto captura CUALQUIER evento que llegue
      this.onMessage?.({ event, data });
    });

    this.socket.on("disconnect", (reason) => {
      this.onClose?.({ reason });
    });

    this.socket.on("connect_error", (error) => {
      this.onError?.(error);
    });
  }

  send(event, payload) {
    // ahora enviamos como evento socket.io
    this.socket.emit(event, payload);
  }
}
