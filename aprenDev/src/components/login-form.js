import { client } from "../app.js";

class LoginForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="loginForm">
        <label>
          <span>Username</span>
          <input name="username" required />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" required />
        </label>
        <button type="submit">Login</button>
      </form>
    `;
    this.querySelector("#loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.currentTarget;
      const payload = {
        username: f.username.value.trim(),
        password: f.password.value,
      };
      client.send("login", payload);
    });
  }
}

customElements.define("login-form", LoginForm);
