import { useState } from "react";
import "../../styles/button.css";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3010/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        alert(`✅ Login exitoso. Bienvenido 👨‍🦲${data.username}`);
        console.log("Token recibido:", data.token);
      } else {
        alert(`❌ Error: ${data.message || "Credenciales inválidas"}`);
      }
    } catch (err) {
      alert("❌ Error de conexión con el servidor");
      console.error(err);
    }

    setUsername("");
    setPassword("");
  }

  return (
    <>
      <img
        src="/monster1.png"
        className="relative w-[12rem] right-7 bottom-12 z-[0] pointer-events-none"
      />

      <div className="relative bg-white w-[8.5rem] h-[5rem] right-0 -top-40 z-[2] rounded-t-2xl flex items-center justify-center">
        <span className="relative text-lg font-semibold bottom-3">Login</span>
      </div>

      <img
        src="/monster1-hands.png"
        className="relative w-[10rem] right-3 bottom-58 z-[3] pointer-events-none"
      />

      <section className="fixed h-full pt-15 w-full top-60 left-0 bg-white p-6 rounded-t-4xl shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center z-10"
        >
          <label className="relative w-full">
            <input
              value={username}
              className="w-full px-5 py-4 border border-[#825D97] rounded-3xl bg-white"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username/DNI"
              required
            />
          </label>

          <label className="relative w-full">
            <input
              type="password"
              className="w-full px-5 py-4 pr-12 border border-[#825D97] rounded-3xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <svg
                width="23"
                height="16"
                viewBox="0 0 23 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 0C6.27273 0 1.80864 3.31733 0 8C1.80864 12.6827 6.27273 16 11.5 16C16.7273 16 21.1914 12.6827 23 8C21.1914 3.31733 16.7273 0 11.5 0ZM11.5 13.3333C8.61454 13.3333 6.27273 10.944 6.27273 8C6.27273 5.056 8.61454 2.66667 11.5 2.66667C14.3855 2.66667 16.7273 5.056 16.7273 8C16.7273 10.944 14.3855 13.3333 11.5 13.3333ZM11.5 4.8C9.76455 4.8 8.36364 6.22933 8.36364 8C8.36364 9.77067 9.76455 11.2 11.5 11.2C13.2355 11.2 14.6364 9.77067 14.6364 8C14.6364 6.22933 13.2355 4.8 11.5 4.8Z"
                  fill="#825D97"
                />
              </svg>
            </button>
          </label>

          <a className="w-full text-lg font-medium text-[#825D97] text-right">Forgotten Password?</a>

          <button className="button-style w-full h-[4.2rem]" type="submit">
            Login
          </button>
        </form>
      </section>
    </>
  );
}
