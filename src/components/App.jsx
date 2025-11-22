import { useEffect, useRef, useState } from "react";
import { client } from "@scripts/client.js";

export default function App() {
  const [status, setStatus] = useState(false);
  const [logLines, setLogLines] = useState([]);
  const canvasRef = useRef(null);

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
    client.handlers.onError = (err) => {
      setStatus(false);
      addLog("WS error:", err);
    };

    // dibujar círculo de estado
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.beginPath();
      ctx.arc(60, 60, 40, 0, Math.PI * 2);
      ctx.fillStyle = status ? "#39b54a" : "#d9534f";
      ctx.fill();
    }
  }, [status]);

  function addLog(...args) {
    const line =
      typeof args[1] === "object"
        ? JSON.stringify(args[1], null, 2)
        : args.join(" ");
    setLogLines((prev) => [...prev, line]);
  }

  return (
    <div>
      <canvas ref={canvasRef} width="120" height="120"></canvas>
      <p>{status ? "WS: conectado" : "WS: desconectado"}</p>
      <pre>{logLines.join("\n")}</pre>
      <button onClick={() => client.send("ping")}>Ping</button>
      <button
        onClick={() =>
          client.send("logout", { username: window.lastUser || "reanito" })
        }
      >
        Logout
      </button>
    </div>
  );
}
