import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <label>
        <span>Username</span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
