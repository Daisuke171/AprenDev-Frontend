import { client } from "@scripts/client.js";
import { useState } from "react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!client.socket || !client.socket.connected) {
      alert("❌ Socket no conectado todavía");
      return;
    }

    client.send("register", {
      username: username.trim(),
      password,
    });

    // Limpiar inputs después de enviar
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

      <button type="submit">Registrar</button>
    </form>
  );
}
