import { get, post, del } from "../modules/fetchManager.mjs";

export default class CollectionsViewController {
  constructor(rootEl, collections = []) {
    this.rootEl = rootEl;
    this.collections = collections;
    this.currentCollection = null;
    this.mode = "my-vinyls"; // Standard modus

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
    this.rootEl.innerHTML = ""; // Tømmer først
    // Tegn navigasjon først (for plassering)
    this.renderNavigation();

    // Flytt hovedtittelen hit, inne i hovedvisningen
    const titleH1 = document.createElement("h1");
    titleH1.textContent = "Vinyl Collection Share";
    this.rootEl.appendChild(titleH1);

    if (this.currentCollection) {
      this.renderDetailView();
    } else {
      this.renderListView();
    }
  }

  renderNavigation() {
    const nav = document.createElement("div");
    nav.innerHTML = `
      <button type="button" id="community-nav-btn">${this.mode === "my-vinyls" ? "Community" : "My Collection"}</button>
      <button type="button" id="logout-btn">Logout</button>
    `;
    this.rootEl.appendChild(nav);

    // Her bruker vi 'nav.querySelector' for å feste funksjonene til knappene vi nettopp laget
    nav.querySelector("#logout-btn").addEventListener("click", () => {
      localStorage.clear();
      location.reload();
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
    
    section.innerHTML = `
      <h2>${this.mode === "my-vinyls" ? "My Vinyl Collections" : "Vinyl Community"}</h2>
      ${this.mode === "my-vinyls" ? `<collection-create></collection-create>` : ""}
      
      <div class="collection-grid">
        ${this.collections.map(c => {
          const isOwner = String(c.user_id) === String(currentUserId);
          return `
            <div class="collection-card">
              <strong>${escapeHtml(c.title)}</strong>
              ${this.mode === "community" ? `<p style="font-size:0.8rem; margin:0;">by ${escapeHtml(c.username)}</p>` : ""}
              <p style="opacity:.7">(${c.album_count || 0} albums)</p>
              <div style="margin-top:10px">
                <button type="button" class="open-btn" data-id="${c.id}">Open</button>
                ${(isOwner && this.mode === "my-vinyls") ? `<collection-delete collection-id="${c.id}"></collection-delete>` : ''}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    section.querySelectorAll(".open-btn").forEach(btn => {
      btn.onclick = () => {
        window.dispatchEvent(new CustomEvent("collection:open", { detail: { id: btn.dataset.id } }));
      };
    });

    this.rootEl.appendChild(section);
  }

  renderDetailView() {
    const currentUserId = localStorage.getItem("userId");
    const isOwner = String(this.currentCollection.user_id) === String(currentUserId);
    
    const section = document.createElement("section");
    section.innerHTML = `
      <button type="button" id="backBtn">← Back</button>
      <h2>${escapeHtml(this.currentCollection.title)}</h2>
      
      ${isOwner ? `<album-add-form collection-id="${this.currentCollection.id}"></album-add-form>` : "<p>Viewing community collection (Read-only)</p>"}

      <h3>Albums</h3>
      <ul id="album-list-container">
        <p>Loading albums...</p>
      </ul>
    `;
    
    this.rootEl.appendChild(section);

    document.getElementById("backBtn").onclick = () => {
      window.dispatchEvent(new CustomEvent("collection:back"));
    };

    this.loadAlbumsForCollection(this.currentCollection.id);
  }

  handleOpen({ id }) {
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
    if(!confirm("Are you sure?")) return;
    await del(`/collections/${id}`);
    await this.refreshCollections();
    this.render();
  }

  async loadAlbumsForCollection(id) {
    try {
      const albums = await get(`/collections/${id}/albums`);
      const listContainer = document.getElementById("album-list-container");
      
      if (albums.length === 0) {
        listContainer.innerHTML = "<p>No albums in this collection yet.</p>";
        return;
      }

      listContainer.innerHTML = albums.map(a => `
        <li class="album-item">
          <div class="album-info">
            <span class="album-title">${escapeHtml(a.title)}</span>
            <span class="album-artist">by ${escapeHtml(a.artist)}</span>
          </div>
        </li>
      `).join("");
    } catch (err) {
      console.error(err);
    }
  }
}

// Custom Elements (Beholdes som de er, de blir bare tegnet eller ikke tegnet basert på render-logikken)
class CollectionCreate extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="margin-bottom: 20px;">
        <form id="col-form">
          <input name="title" placeholder="New Collection Title" required />
          <button type="submit">Create Collection</button>
        </form>
      </div>
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
// Forhindrer re-definering av custom elements, som kan gi feilmelding
if (!customElements.get("collection-create")) customElements.define("collection-create", CollectionCreate);

class CollectionDelete extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("collection-id");
    // Standardisert styling for delete-knappen
    this.innerHTML = `<button type="button" style="color: red; margin-left: 5px; background:none; border:none; box-shadow:none; font-size:0.7rem; cursor:pointer;">Delete</button>`;
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
      <form id="album-form" style="background: #FAFAFA; border: 2px solid #F0F0F0; padding: 15px; border-radius: 12px; margin: 15px 0;">
        <input name="title" placeholder="Album Title" required />
        <input name="artist" placeholder="Artist Name" required />
        <button type="submit">Add Vinyl</button>
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