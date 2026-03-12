import { useState } from "react";
import { io } from "socket.io-client";
import "../../styles/global.css";
import "../../styles/button.css";

const SOCKET_URL =
  import.meta.env.VITE_WS_URL ??
  import.meta.env.PUBLIC_API_BASE ??
  "http://localhost:3010";

console.log("🔌 SOCKET_URL:", SOCKET_URL);

// Mantenemos la instancia del socket fuera para evitar múltiples conexiones
const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("✅ Socket conectado. ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket desconectado");
});

socket.on("connect_error", (err) => {
  console.error("🔴 Socket connection error:", err?.message ?? err);
});

socket.on("error", (err) => {
  console.error("🔴 Socket error:", err);
});

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("🔍 Estado del socket:", {
      connected: socket.connected,
      id: socket.id,
      url: socket.io.engine.hostname,
    });

    if (!socket.connected) {
      alert("⚠️ Socket no conectado. Esperando reconexión...");
      // Intentar reconectar
      socket.connect();
      console.log("🔄 Intentando reconectar socket...");
      return;
    }

    if (!username.trim() || !password.trim()) {
      alert("⚠️ Por favor completa todos los campos");
      return;
    }

    console.log("📤 Enviando login para usuario:", username);

    // 1. Enviamos los datos
    socket.emit("login", {
      username: username.trim(),
      password,
    });

    // 2. Escuchamos la respuesta (puede venir como "login" o "error")
    let responseReceived = false;

    const loginHandler = (data) => {
      if (responseReceived) return;
      responseReceived = true;
      
      console.log("📥 Respuesta del servidor (login):", data);
      clearTimeout(timeoutId);
      socket.off("login", loginHandler);
      socket.off("error", errorHandler);
      
      if (data.ok) {
        console.log("✅ Login exitoso");
        alert(`✅ Login exitoso. Bienvenido ${data.username}`);
        document.cookie = `session_id=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        console.error("❌ Login fallido:", data.message);
        alert(`❌ Error: ${data.message || "Credenciales inválidas"}`);
        setPassword("");
      }
    };

    const errorHandler = (error) => {
      if (responseReceived) return;
      responseReceived = true;
      
      console.error("📥 Error del servidor:", error);
      clearTimeout(timeoutId);
      socket.off("login", loginHandler);
      socket.off("error", errorHandler);
      
      const errorMsg = error?.message || error?.error || "Error desconocido";
      console.error("❌ Login fallido:", errorMsg);
      alert(`❌ Error: ${errorMsg}`);
      setPassword("");
    };

    const timeoutId = setTimeout(() => {
      if (responseReceived) return;
      responseReceived = true;
      
      socket.off("login", loginHandler);
      socket.off("error", errorHandler);
      console.error("⏱️ Timeout esperando respuesta de login (10s)");
      alert("⏱️ Tiempo agotado. El servidor no responde.\nVerifica que esté activo en http://localhost:3010");
    }, 10000);

    socket.once("login", loginHandler);
    socket.once("error", errorHandler);

    // 3. Limpiamos los campos SOLO después de intentar el envío
    setUsername("");
    setPassword("");
  }

  // El return DEBE estar dentro de la función LoginForm
  return (
    <>
      <main className="fixed">
        <img
          src="/textBubble.png"
          className="relative w-40 left-35 bottom-0 z-1"
          alt="bubble"
        />

        <img
          src="/monster1.png"
          className="relative w-48 right-7 bottom-21 z-0 pointer-events-none"
          alt="monster"
        />
        <p className="relative bottom-77 left-42 z-5 text-[1rem] font-semibold text-[#240E59] select-none">
          Welcome back!
        </p>

        <div className="relative bg-white w-34 h-20 right-0 -top-55 z-2 rounded-t-2xl flex items-center justify-center">
          <ClickGlowSpan>Log in</ClickGlowSpan>
        </div>

        <img
          src="/monster1-hands.png"
          className="relative w-40 right-3 bottom-72 z-3 pointer-events-none"
          alt="hands"
        />

        <div className="relative bg-[#C9C0DE] w-34 h-20 left-40 -top-84 z-0 rounded-t-2xl flex items-center justify-center">
          <ClickGlowSpan>
            <a href="/register">Sign up</a>
          </ClickGlowSpan>
        </div>

        <section
          className="flex relative bottom-90 right-8 pt-20 bg-white p-6 rounded-t-4xl w-screen overflow-y-auto justify-center"
          style={{ height: "calc(100svh - 225px)" }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 items-center w-full max-w-[400px] z-10"
          >
            <label className="relative w-full flex justify-center">
              <input
                value={username}
                className="w-[90%] max-w-[400px] px-5 py-4 border border-[#825D97] rounded-3xl bg-white"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username/DNI"
                required
              />
            </label>

            <label className="relative w-full flex justify-center">
              <input
                type={showPassword ? "text" : "password"}
                className="w-[90%] max-w-[400px] px-5 py-4 pr-12 border border-[#825D97] rounded-3xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-10 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-.722-3.25" />
                    <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                    <path d="m20 15-1.726-2.05" />
                    <path d="m4 15 1.726-2.05" />
                    <path d="m9 18 .722-3.25" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </label>

            <div className="flex flex-col pb-10 w-fit">
              <a className="w-full text-lg font-medium text-[#825D97] text-right cursor-pointer select-none">
                Forgotten Password?
              </a>
              <button
                className="button-style w-70 h-[4.2rem] cursor-pointer select-none relative top-10"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

// Sub-componente ClickGlowSpan fuera de la función principal
function ClickGlowSpan({ children }) {
  const [animating, setAnimating] = useState(false);

  function handleClick() {
    if (animating) {
      setAnimating(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimating(true)),
      );
    } else {
      setAnimating(true);
    }
  }

  return (
    <span
      onClick={handleClick}
      onAnimationEnd={() => setAnimating(false)}
      className={`relative text-lg font-semibold bottom-3 cursor-pointer select-none
                  hover:text-[#753aff] ${
                    animating ? "animate-click-glow text-[#753aff]" : ""
                  }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      {children}
    </span>
  );
}
