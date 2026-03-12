import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "../../styles/global.css";
import "../../styles/button.css";

const socket = io("http://localhost:3010", {
  withCredentials: false,
  transports: ["websocket", "polling"] 
});

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [lastname, setLastname] = useState("");
  const [dni, setDni] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // Escuchar la respuesta del servidor
  useEffect(() => {
    socket.on("register_response", (data) => {
      if (data.status === "ok") {
        alert(`✅ Usuario ${data.payload.username} registrado correctamente`);
        // Redirigir al login
        window.location.href = "/login";
      } else {
        alert(`❌ Error: ${data.message || "No se pudo registrar"}`);
      }
    });

    socket.on("error", (err) => {
      alert(`❌ Error del servidor: ${err.message}`);
    });

    return () => {
      socket.off("register_response");
      socket.off("error");
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    // Validación básica antes de enviar al socket
    if (dni.length < 8) {
      alert("❌ El DNI parece demasiado corto");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    socket.emit("register", {
      username: username.trim(),
      lastname: lastname.trim(),
      dni: dni.trim(),
      birthday,
      password,
    });

    // Limpiar inputs después de enviar
    setUsername("");
    setLastname("");
    setDni("");
    setBirthday("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <>
      <main className="fixed">
        <img
          src="/textBubble2.png"
          className="relative w-40 left-2 top-2 z-1"
        ></img>

        <img
          src="/monster1.png"
          className="relative w-48 left-33 bottom-27 z-0 pointer-events-none"
        />

        <div className="relative bg-[#C9C0DE] w-34 h-20 right-0 -top-55 z-0 rounded-t-2xl flex items-center justify-center">
          <ClickGlowSpan>
            <a href="/login">Log in</a>
          </ClickGlowSpan>
        </div>

        <img
          src="/monster1-hands.png"
          className="relative w-40 left-37 bottom-72 z-3 pointer-events-none"
        />

        <div className="relative bg-white  w-34 h-20 left-40 -top-84 z-2 rounded-t-2xl flex items-center justify-center">
          <ClickGlowSpan>Sign up</ClickGlowSpan>
        </div>

        <section
          className="flex relative bottom-90 right-8 pt-10 bg-white p-6 rounded-t-4xl w-screen justify-center overflow-scroll"
          style={{ height: "calc(100svh - 225px)" }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 items-center w-full max-w-[400px] z-10"
          >
            <label className="relative w-full flex justify-center">
              {" "}
              <input
                value={username}
                className="w-[90%] max-w-[400px] px-5 py-4 border border-[#825D97] rounded-3xl bg-white text-[#825D97]"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Name"
                required
              />
            </label>

            <label className="relative w-full flex justify-center">
              {" "}
              <input
                value={lastname}
                className="w-[90%] max-w-[400px] px-5 py-4 border border-[#825D97] rounded-3xl bg-white text-[#825D97]"
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last name"
                required
              />
            </label>

            <label className="relative w-full flex justify-center">
              {" "}
              <input
                value={dni}
                className="w-[90%] max-w-[400px] px-5 py-4 border border-[#825D97] rounded-3xl bg-white text-[#825D97]"
                onChange={(e) => setDni(e.target.value)}
                placeholder="DNI"
                required
              />
            </label>

            <label className="relative w-full flex justify-center">
              {" "}
              <input
                value={birthday}
                type="date"
                className="w-[90%] max-w-[400px] px-5 py-4 border border-[#825D97] rounded-3xl bg-white text-[#825D97]"
                onChange={(e) => setBirthday(e.target.value)}
                placeholder="DNI"
                required
              />
            </label>

            <label className="relative w-full flex justify-center">
              <input
                type={showPassword ? "text" : "password"}
                className="w-[90%] max-w-[400px] px-5 py-4 pr-12 border border-[#825D97] rounded-3xl text-[#825D97]"
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
                  /* ojo cerrado */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-eye-closed-icon lucide-eye-closed"
                  >
                    <path d="m15 18-.722-3.25" />
                    <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                    <path d="m20 15-1.726-2.05" />
                    <path d="m4 15 1.726-2.05" />
                    <path d="m9 18 .722-3.25" />
                  </svg>
                ) : (
                  /* ojo abierto */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-eye-icon lucide-eye"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </label>

            <label className="relative w-full flex justify-center">
              <input
                type={showPassword2 ? "text" : "password"}
                className="w-[90%] max-w-[400px] px-5 py-4 pr-12 border border-[#825D97] rounded-3xl text-[#825D97]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-10 top-1/2 -translate-y-1/2"
              >
                {showPassword2 ? (
                  /* ojo cerrado */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-eye-closed-icon lucide-eye-closed"
                  >
                    <path d="m15 18-.722-3.25" />
                    <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                    <path d="m20 15-1.726-2.05" />
                    <path d="m4 15 1.726-2.05" />
                    <path d="m9 18 .722-3.25" />
                  </svg>
                ) : (
                  /* ojo abierto */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-eye-icon lucide-eye"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </label>

            <div className="flex flex-col pb-10 w-fit">
              <button
                className="button-style w-70 h-[4.2rem] cursor-pointer select-none mb-15"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

function ClickGlowSpan({ children }) {
  const [animating, setAnimating] = useState(false);

  function handleClick() {
    // start animation; if already animating we restart by toggling off then on.
    if (animating) {
      setAnimating(false);
      // next tick set true so animation restarts
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
