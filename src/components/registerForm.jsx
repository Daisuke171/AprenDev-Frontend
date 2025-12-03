import { useState } from "react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [lastname, setLastname] = useState("");
  const [dni, setDni] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:3010/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          lastname: lastname.trim(),
          dni: Number(dni),
          birthday,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      //si el back llega al return y el usuario es válido se ejecuta el if
      //si responde con false se ejecuta el else
      if (res.ok && data.user) {
        alert(`✅ Usuario ${data.user.username} registrado correctamente`);
      } else {
        alert(`❌ Error: ${data.message|| "No se pudo registrar"}`);
      }

    } catch (err) {
      alert("❌ Error de conexión con el servidor");
      console.error(err);
    }

    // Limpiar inputs después de enviar
    setUsername("");
    setLastname("");
    setDni("");
    setBirthday("");
    setPassword("");
    setConfirmPassword("");
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
        <span>Lastname</span>
        <input
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
      </label>

      <label>
        <span>DNI</span>
        <input
          type="number"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
        />
      </label>

      <label>
        <span>Birthday</span>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
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

      <label>
        <span>Confirm Password</span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>

      <button type="submit">Registrar</button>
    </form>
  );
}
