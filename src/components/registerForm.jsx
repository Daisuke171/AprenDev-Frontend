import { client } from "@scripts/client.js";
import { useState } from "react";

export default function RegisterForm() {
  //username y password guarda lo que el usuario escribe en el input
  //setUsername y setPassword actualizan username y password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    //si no hay coneccion con el servidor, se muestra un alerta
    if (!client.ws || client.ws.readyState !== WebSocket.OPEN) {
      alert("WebSocket no conectado todavía");
      return;
    }
    //send esta definido en ws.js
    //client.send decide que accion quiere ejecutar ("register", "login", etc)
    //el handler de register recibe el type de aqui que es register y le pasa el playload que es lo que esta en {}
    client.send("register", { username: username.trim(), password });
  }
  //value=username es del useState
  //onChange es un evento que se ejecuta cuando cambia el valor del input
  //lo de onechange permite con setusername que se guarde en el useState lo que el usuario escribe
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
