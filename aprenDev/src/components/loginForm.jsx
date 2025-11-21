import { client } from "@scripts/client.js";
import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!client.ws || client.ws.readyState !== WebSocket.OPEN) {
      alert("WebSocket no conectado todavía");
      return;
    }

    client.send("login", { username: username.trim(), password });
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
