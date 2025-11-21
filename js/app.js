import { WSClient } from "./ws.js";
import "./components/register-form.js";
import "./components/login-form.js";

export const client = new WSClient({
  onOpen: () => {
    setStatus(true);
    log("WS conectado");
  },
  onMessage: (data) => {
    log("Mensaje:", data);
    // podés reaccionar por tipo
    if (data?.type === "error") setStatus(false);
    if (data?.type === "ok") setStatus(true);
  },
  onClose: () => {
    setStatus(false);
    log("WS desconectado");
  },
  onError: (err) => {
    setStatus(false);
    log("WS error:", err);
  },
});

client.connect();

document.getElementById("btnPing").addEventListener("click", () => {
  try { client.send("ping"); } catch (e) { log(e.message); }
});

document.getElementById("btnLogout").addEventListener("click", () => {
  // si usás sesiones por username:
  const lastUser = window.lastUser || "reanito";
  try { client.send("logout", { username: lastUser }); } catch (e) { log(e.message); }
});

function log(...args) {
  const pre = document.getElementById("log");
  const line = typeof args[1] === "object" ? JSON.stringify(args[1], null, 2) : args.join(" ");
  pre.textContent += `${line}\n`;
  pre.scrollTop = pre.scrollHeight;
}

function setStatus(connected) {
  const el = document.getElementById("wsStatus");
  el.textContent = connected ? "WS: conectado" : "WS: desconectado";
  drawStatus(connected ? "#39b54a" : "#d9534f");
}

// Canvas: dibuja un círculo verde/rojo según conexión
function drawStatus(color) {
  const canvas = document.getElementById("statusCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(60, 60, 40, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

client.connect();
