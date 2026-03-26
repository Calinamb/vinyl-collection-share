import { get, post, del } from "../modules/fetchManager.mjs";
import { t } from "../modules/i18n.mjs";

export default class UsersViewController {
  constructor(rootEl, users = []) {
    this.rootEl = rootEl;
    this.users = users;

    window.addEventListener("user:create", (e) => this.handleCreate(e.detail));
    window.addEventListener("user:delete", (e) => this.handleDelete(e.detail));
    window.addEventListener("user:edit", (e) => this.handleEdit(e.detail));

    this.render();
  }

  render() {
    this.rootEl.innerHTML = `
      <section>
        <h2>${t("users_title")}</h2>
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
    try {
      this.users = await get("/users");
      this.render();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async handleCreate({ username, consent }) {
    try {
      await post("/users", { username, consent });
      await this.refreshUsers();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async handleDelete({ id }) {
    await del(`/users/${id}`);
    await this.refreshUsers();
  }

  async handleEdit({ id, username }) {
    const user = this.users.find(u => u.id === id);
    if (!user) return;
    user.username = username;
    this.render();
  }
}


class UserCreate extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section>
        <h2>${t("create_user_title")}</h2>
        <form id="f">
          <label>
            ${t("username_label")}
            <input name="username" required />
          </label>
          <label style="display:block; margin-top:8px;">
            <input type="checkbox" name="consent" />
            ${t("consent_label")}
          </label>
          <button type="submit" style="margin-top:8px;">${t("create_user_btn")}</button>
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
        this.querySelector("#msg").textContent = t("error_agree_terms");
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
    this.innerHTML = `<button type="button">${t("delete_btn")}</button>`;
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
        <span style="display:none">${t("edit_label")}</span>
        <input value="${escapeAttr(username)}" />
      </label>
      <button type="button">${t("save_btn")}</button>
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



function escapeHtml(str) {
  return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll('"', "&quot;");
}