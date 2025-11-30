import { useEffect, useState } from "react";
import { client } from "@scripts/client.js";

export default function App() {
  const [status, setStatus] = useState();
  const [logLines, setLogLines] = useState([]);

  useEffect(() => {
    // Reasignamos handlers para trabajar con Socket.IO
    client.onOpen = () => {
      setStatus(true);
      addLog("🔌 Socket conectado");
    };

    client.onMessage = ({ event, data }) => {
      addLog(`📩 Evento recibido (${event}):`, data);

      if (event === "error") setStatus(false);
      if (event === "ok") setStatus(true);
    };

    client.onClose = (info) => {
      setStatus(false);
      addLog("❌ Desconectado:", info);
    };

    client.onError = (err) => {
      setStatus(false);
      addLog("⚠️ Error Socket:", err);
    };

    // Conecta solo una vez
    client.connect();

    return () => {
      client.close?.();
    };
  }, []);

  function addLog(...args) {
    const line =
      typeof args[1] === "object"
        ? args[0] + " " + JSON.stringify(args[1], null, 2)
        : args.join(" ");
    setLogLines((prev) => [...prev, line]);
  }

  return (
    <div>
      <h2>Estado: {status ? "🟢 Conectado" : "🔴 Desconectado"}</h2>
      <pre>{logLines.join("\n")}</pre>
    </div>
  );
}
