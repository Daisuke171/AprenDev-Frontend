const WS_URL = "ws://localhost:8080";

export class WSClient {
  constructor({ onOpen, onMessage, onClose, onError }) {
    this.ws = null;
    this.handlers = { onOpen, onMessage, onClose, onError };
  }

  connect() {
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => this.handlers.onOpen?.();
    this.ws.onmessage = (evt) => {
      let data;
      try { data = JSON.parse(evt.data); } catch { data = evt.data; }
      this.handlers.onMessage?.(data);
    };
    this.ws.onclose = () => this.handlers.onClose?.();
    this.ws.onerror = (err) => this.handlers.onError?.(err);
  }

  send(type, payload = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket no conectado");
    }
    this.ws.send(JSON.stringify({ type, payload }));
  }
}
