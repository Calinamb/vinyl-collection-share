import { get, post, del } from "../modules/fetchManager.mjs";
import { t } from "../modules/i18n.mjs";

export default class CollectionsViewController {
  constructor(rootEl, collections = []) {
    this.rootEl = rootEl;
    this.collections = collections;
    this.currentCollection = null;
    this.mode = "my-vinyls";

    window.addEventListener("collection:create", (e) => this.handleCreate(e.detail));
    window.addEventListener("collection:delete", (e) => this.handleDelete(e.detail));
    window.addEventListener("collection:open", (e) => this.handleOpen(e.detail));
    window.addEventListener("collection:back", () => {
      this.currentCollection = null;
      this.render();
    });
    window.addEventListener("album:add", (e) => this.handleAddAlbum(e.detail));

    this.render();
  }

  render() {
    this.rootEl.innerHTML = "";
    this.renderNavigation();

    if (this.currentCollection) {
      this.renderDetailView();
    } else {
      this.renderListView();
    }
  }

  renderNavigation() {
    const username = localStorage.getItem("username") || "User";
    const nav = document.createElement("div");
    nav.className = "nav-container";
    nav.innerHTML = `
      <button type="button" id="hamburger-btn" aria-label="Open menu" class="hamburger-btn">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <button type="button" id="community-nav-btn">
        ${this.mode === "my-vinyls" ? t("nav_community") : t("nav_my_collection")}
      </button>

      <div id="drawer-overlay" class="drawer-overlay"></div>

      <nav id="side-drawer" class="side-drawer" aria-label="Main menu">
        <button type="button" id="close-drawer-btn" aria-label="Close menu" class="close-drawer-btn">✕</button>
        <p class="drawer-username"> ${escapeHtml(username)}</p>
        <button type="button" id="logout-btn" class="drawer-btn">${t("nav_logout")}</button>
      </nav>
      <div class="delete-account-section">
  <p class="delete-account-warning">${t("delete_account_warning")}</p>
  <button type="button" id="delete-account-btn" class="drawer-btn btn-danger">${t("nav_delete_account")}</button>
</div>
    `;

    this.rootEl.appendChild(nav);

    nav.querySelector("#hamburger-btn").addEventListener("click", () => {
      nav.querySelector("#side-drawer").classList.add("side-drawer--open");
      nav.querySelector("#drawer-overlay").classList.add("drawer-overlay--visible");
    });

    const closeDrawer = () => {
      nav.querySelector("#side-drawer").classList.remove("side-drawer--open");
      nav.querySelector("#drawer-overlay").classList.remove("drawer-overlay--visible");
    };

    nav.querySelector("#close-drawer-btn").addEventListener("click", closeDrawer);
    nav.querySelector("#drawer-overlay").addEventListener("click", closeDrawer);

    nav.querySelector("#logout-btn").addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });

    nav.querySelector("#delete-account-btn").addEventListener("click", async () => {
      closeDrawer();
      if (!confirm(t("confirm_delete_account"))) return;
      const userId = localStorage.getItem("userId");
      try {
        await del(`/users/${userId}`);
        localStorage.clear();
        window.location.href = "index.html";
      } catch (err) {
        alert(t("error_delete_account") + " " + err.message);
      }
    });

    nav.querySelector("#community-nav-btn").addEventListener("click", async () => {
      this.mode = (this.mode === "my-vinyls") ? "community" : "my-vinyls";
      this.currentCollection = null;
      await this.refreshCollections();
      this.render();
    });
  }

  renderListView() {
    const currentUserId = localStorage.getItem("userId");
    const section = document.createElement("section");
    section.className = "section-full";

    section.innerHTML = `
      <h2>${this.mode === "my-vinyls" ? t("my_collections") : t("community")}</h2>
      ${this.mode === "my-vinyls" ? `<collection-create></collection-create>` : ""}
      <div class="collection-grid">
        ${this.collections.map(c => {
          const isOwner = String(c.user_id) === String(currentUserId);
          return `
        <div class="collection-card">
        <strong>${escapeHtml(c.title)}</strong>
        ${this.mode === "community" ? `<p class="collection-owner">${t("by")} ${escapeHtml(c.username)}</p>` : ""}
       <p class="collection-count">(${c.album_count || 0} ${t("albums_count")})</p>
       <div class="collection-card-actions">
       <button type="button" class="open-btn" data-id="${c.id}">${t("open")}</button>
    ${(isOwner && this.mode === "my-vinyls") ? `<collection-delete collection-id="${c.id}"></collection-delete>` : ""}
  </div>
</div>
          `;
        }).join("")}
      </div>
    `;

    section.querySelectorAll(".open-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("collection:open", { detail: { id: btn.dataset.id } }));
      });
    });

    this.rootEl.appendChild(section);
  }
renderDetailView() {
  const currentUserId = localStorage.getItem("userId");
  const isOwner = String(this.currentCollection.user_id) === String(currentUserId);

  const section = document.createElement("section");
  section.className = "section-full";
  section.innerHTML = `
    <div class="detail-header">
      <button type="button" id="backBtn" class="back-btn">${t("back")}</button>
      <h2 class="detail-title">${escapeHtml(this.currentCollection.title)}</h2>
    </div>

    <div class="detail-body">
      ${isOwner ? `
        <div class="detail-left">
          <album-add-form collection-id="${this.currentCollection.id}"></album-add-form>
        </div>
      ` : ""}
      <div class="detail-right ${isOwner ? "" : "detail-right--full"}">
        <h3>${t("albums_heading")}</h3>
        <ul id="album-list-container" class="album-list">
          <p>${t("loading_albums")}</p>
        </ul>
      </div>
    </div>
  `;

  this.rootEl.appendChild(section);

  document.getElementById("backBtn").onclick = () => {
    window.dispatchEvent(new CustomEvent("collection:back"));
  };

  this.loadAlbumsForCollection(this.currentCollection.id);
}

  async handleOpen({ id }) {
    this.currentCollection = this.collections.find(c => String(c.id) === String(id));
    this.render();
  }

  async handleAddAlbum({ collectionId, artist, title }) {
    await post(`/collections/${collectionId}/albums`, { artist, title });
    await this.refreshCollections();
    this.currentCollection = this.collections.find(c => String(c.id) === String(collectionId));
    this.render();
  }

  async refreshCollections() {
    try {
      const userId = localStorage.getItem("userId");
      const url = (this.mode === "my-vinyls") ? `/collections/user/${userId}` : `/collections/all`;
      this.collections = await get(url);
    } catch (err) {
      console.error(err);
    }
  }

  async handleCreate({ title }) {
    const userId = localStorage.getItem("userId");
    await post("/collections", { title, userId });
    await this.refreshCollections();
    this.render();
  }

  async handleDelete({ id }) {
    if (!confirm(t("confirm_delete_collection"))) return;
    await del(`/collections/${id}`);
    await this.refreshCollections();
    this.render();
  }

  async loadAlbumsForCollection(id) {
    try {
      const albums = await get(`/collections/${id}/albums`);
      const listContainer = document.getElementById("album-list-container");

      if (!albums || albums.length === 0) {
        listContainer.innerHTML = `<p>${t("no_albums")}</p>`;
        return;
      }

      listContainer.innerHTML = albums.map(a => `
        <li class="album-item">
          <strong>${escapeHtml(a.title)}</strong>
          <span>${escapeHtml(a.artist)}</span>
        </li>
      `).join("");
    } catch (err) {
      console.error(err);
    }
  }
}

class CollectionCreate extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="col-form" class="form-container">
        <input name="title" placeholder="${t("new_collection_placeholder")}" required />
        <button type="submit">${t("create_collection")}</button>
      </form>
    `;
    this.querySelector("#col-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const title = String(fd.get("title") || "").trim();
      if (!title) return;
      window.dispatchEvent(new CustomEvent("collection:create", { detail: { title } }));
      e.target.reset();
    });
  }
}
if (!customElements.get("collection-create")) customElements.define("collection-create", CollectionCreate);

class CollectionDelete extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("collection-id");
    this.innerHTML = `<button type="button" class="delete-btn" aria-label="Delete collection">${t("delete_btn")}</button>`;
    this.querySelector("button").addEventListener("click", () => {
      if (!id) return;
      window.dispatchEvent(new CustomEvent("collection:delete", { detail: { id } }));
    });
  }
}
if (!customElements.get("collection-delete")) customElements.define("collection-delete", CollectionDelete);

class AlbumAddForm extends HTMLElement {
  connectedCallback() {
    const colId = this.getAttribute("collection-id");
    this.innerHTML = `
      <form id="album-form" class="form-container">
        <input name="title" placeholder="${t("album_title_placeholder")}" required />
        <input name="artist" placeholder="${t("artist_placeholder")}" required />
        <button type="submit">${t("add_vinyl")}</button>
      </form>
    `;
    this.querySelector("#album-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      window.dispatchEvent(new CustomEvent("album:add", {
        detail: { collectionId: colId, artist: fd.get("artist"), title: fd.get("title") }
      }));
      e.target.reset();
    });
  }
}
if (!customElements.get("album-add-form")) customElements.define("album-add-form", AlbumAddForm);

function escapeHtml(str) {
  return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}