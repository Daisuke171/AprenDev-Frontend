//URL del servidor WebSocket donde el frontend se va a conectar
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";



//Clase que maneja la conexión con el servidor WebSocket
export class WSClient {
  constructor({ onOpen, onMessage, onClose, onError }) {
    //Constructor con callbacks para manejar eventos
    this.handlers = { onOpen, onMessage, onClose, onError }; //se guarda en this.handlers los callbacks
    this.ws = null; //es null porque aun no hay coneccion
  }

  //metodo connect abre la conexión con el servidor usando la URL 
  connect() {
    this.ws = new WebSocket(WS_URL);//crea el objeto de coneccion

    //handlers.onOpen, etc, se define en client.js
    this.ws.onopen = () => this.handlers.onOpen?.();
    //funciona igual que el raw en backend server.js
    //cuando llega info del servidor, se parsea y la data se pasa a onMessage
    this.ws.onmessage = (evt) => {
      let data;
      try {
        data = JSON.parse(evt.data);
      } catch {
        data = evt.data;
      }
      this.handlers.onMessage?.(data);
    };
    //se ejecuta cuando se cierra la coneccion
    this.ws.onclose = () => this.handlers.onClose?.();
    //se ejecuta cuando hay un error en la coneccion
    this.ws.onerror = (err) => this.handlers.onError?.(err);
  }
//metodo send envia un mensaje al servidor
  send(type, payload = {}) {
    //se verifica que ws este conectado
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket no conectado");
    }
    
    // devuelve un objeto con la informacion del mensaje que se define en los componentes jsx
    this.ws.send(JSON.stringify({ type, payload }));
  }
}
