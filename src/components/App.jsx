import { useEffect, useState } from "react";
import { client } from "@scripts/client.js";

export default function App() {
  //status guarda el estado de la coneccion con el servidor, setStatus actualiza el estado
  const [status, setStatus] = useState();
  //logLines es un array almacena los mensajes de log que se muestran en la consola
  const [logLines, setLogLines] = useState([]);

  //reasignamos los handlers de client.js para que actualicen el estado y el log
  //useefect engancha los handlers con los estados para que la coneccion se refleje en la interfaz
  useEffect(() => {
    client.handlers.onOpen = () => {
      setStatus(true);
      addLog("WS conectado");
    };
    client.handlers.onMessage = (data) => {
      addLog("Mensaje:", data);
      if (data?.type === "error") setStatus(false);
      if (data?.type === "ok") setStatus(true);
    };
    client.handlers.onClose = () => {
      setStatus(false);
      addLog("WS desconectado");
    };
    client.handlers.onUndefined = (undefined) => {
      setStatus(undefined);
      addLog("WS undefined");
    }
    client.handlers.onError = (err) => {
      setStatus(false);
      addLog("WS error:", err);
    };
  }, []);

  //funcion que agrega un mensaje a logLines
  //transforma el objeto en un json string si es un objeto
  function addLog(...args) {
    const line =
      typeof args[1] === "object"
        ? JSON.stringify(args[1], null, 2)
        : args.join(" ");
    setLogLines((prev) => [...prev, line]);
  }

  //se guardan los addlogs en loglines
  return (
    <div>
      <pre>{logLines.join("\n")}</pre> 
    </div>
  );
}
