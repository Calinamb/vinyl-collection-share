import { get, post, del } from "../modules/fetchManager.mjs";


export default class UsersViewController {
  constructor(rootEl, users = []) {
    this.rootEl = rootEl;
    this.users = users;

    // Lytt på events fra web components
    window.addEventListener("user:create", (e) => this.handleCreate(e.detail));
    window.addEventListener("user:delete", (e) => this.handleDelete(e.detail));
    window.addEventListener("user:edit", (e) => this.handleEdit(e.detail));

    this.render();
  }

  render() {
    this.rootEl.innerHTML = `
      <section>
        <h2>Users</h2>
        <ul>
          ${this.users.map(u => `
            <li>
              <strong>${escapeHtml(u.username)}</strong>
              <small style="opacity:.7">(${u.id})</small>
              <div style="margin-top:6px">
                <user-edit user-id="${u.id}" username="${escapeAttr(u.username)}"></user-edit>
                <user-delete user-id="${u.id}"></user-delete>
              </div>
            </li>
          `).join("")}
        </ul>
      </section>
    `;
  }

  async refreshUsers() {
    this.users = await get("/users");
    this.render();
  }

  async handleCreate({ username, consent }) {
    await post("/users", { username, consent });
    await this.refreshUsers();
  }

  async handleDelete({ id }) {
    await del(`/users/${id}`);
    await this.refreshUsers();
  }

  /**
   * EDIT: Serveren din har ikke PUT /users/:id enda.
   * For å oppfylle oppgaven lager vi UI-komponenten og gjør "edit" lokalt i listen.
   * Når du senere lager PUT-endepunkt kan du bytte dette til API-kall.
   */
  async handleEdit({ id, username }) {
    const user = this.users.find(u => u.id === id);
    if (!user) return;

    user.username = username;
    this.render();
  }
}

/* ---------------- Web Components ---------------- */

class UserCreate extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section>
        <h2>Create user</h2>
        <form id="f">
          <label>
            Username:
            <input name="username" required />
          </label>
          <label style="display:block; margin-top:8px;">
            <input type="checkbox" name="consent" />
            I accept Terms of Service & Privacy Policy
          </label>
          <button type="submit" style="margin-top:8px;">Create</button>
          <p id="msg" style="color:#b00;"></p>
        </form>
      </section>
    `;

    this.querySelector("#f").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const username = String(fd.get("username") || "").trim();
      const consent = fd.get("consent") === "on";

      if (!username) return;
      if (!consent) {
        this.querySelector("#msg").textContent = "You must consent before creating an account.";
        return;
      }

      this.querySelector("#msg").textContent = "";
      window.dispatchEvent(new CustomEvent("user:create", { detail: { username, consent } }));
      e.target.reset();
    });
  }
}
customElements.define("user-create", UserCreate);

class UserDelete extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("user-id");
    this.innerHTML = `<button type="button">Delete</button>`;
    this.querySelector("button").addEventListener("click", () => {
      if (!id) return;
      window.dispatchEvent(new CustomEvent("user:delete", { detail: { id } }));
    });
  }
}
customElements.define("user-delete", UserDelete);

class UserEdit extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("user-id");
    const username = this.getAttribute("username") || "";

    this.innerHTML = `
      <label>
        <span style="display:none">Edit</span>
        <input value="${escapeAttr(username)}" />
      </label>
      <button type="button">Save</button>
    `;

    const input = this.querySelector("input");
    this.querySelector("button").addEventListener("click", () => {
      if (!id) return;
      const newName = input.value.trim();
      if (!newName) return;
      window.dispatchEvent(new CustomEvent("user:edit", { detail: { id, username: newName } }));
    });
  }
}
customElements.define("user-edit", UserEdit);

/* ---------------- Helpers ---------------- */

function escapeHtml(str) {
  return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll('"', "&quot;");
}
