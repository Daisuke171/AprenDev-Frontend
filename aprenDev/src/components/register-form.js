import { client } from "../app.js";

class RegisterForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="registerForm">
        <label>
          <span>Username</span>
          <input name="username" required />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" required />
        </label>
        <button type="submit">Registrar</button>
      </form>
    `;
    const form = this.querySelector("#registerForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Verificar conexión antes de enviar
      if (!client.ws || client.ws.readyState !== WebSocket.OPEN) {
        alert("WebSocket no conectado todavía");
        return;
      }

      const payload = {
        username: form.username.value.trim(),
        password: form.password.value,
      };
      client.send("register", payload);
    });
  }
}

customElements.define("register-form", RegisterForm);
