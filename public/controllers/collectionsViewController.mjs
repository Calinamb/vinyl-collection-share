import { get, post, del } from "../modules/fetchManager.mjs";

export default class CollectionsViewController {
  constructor(rootEl, collections = []) {
    this.rootEl = rootEl;
    this.collections = collections;


    window.addEventListener("collection:create", (e) => this.handleCreate(e.detail));
    window.addEventListener("collection:delete", (e) => this.handleDelete(e.detail));


    this.render();
  }

  render() {
    this.rootEl.innerHTML = `
      <section>
        <h2>My Vinyl Collections</h2>
        <collection-create></collection-create>
        <ul class="collection-list">
          ${this.collections.map(c => `
         <li class="collection-item">
         <strong>${escapeHtml(c.title)}</strong>
        <small style="opacity:.7">(${c.albums?.length || 0} albums)</small>
        <div style="margin-top:6px">
        <button type="button" class="open-btn" data-id="${c.id}">Open</button>
        <collection-delete collection-id="${c.id}"></collection-delete>
        </div>
        </li>
          `).join("")}
        </ul>
      </section>
    `;

    this.rootEl.querySelectorAll(".open-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            window.dispatchEvent(new CustomEvent("collection:open", { detail: { id: btn.dataset.id } }));
        });
    });
  }

  async refreshCollections() {
    try {
      this.collections = await get("/collections");
      this.render();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

 async handleCreate({ title }) {
    await post("/collections", { title });
    await this.refreshCollections(); 
}

async handleDelete({ id }) {
    await del(`/collections/${id}`);
    await this.refreshCollections(); 
}


}

/* ---------------- Web Components ---------------- */

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
customElements.define("collection-create", CollectionCreate);

class CollectionDelete extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("collection-id");
    this.innerHTML = `<button type="button" style="color: red;">Delete</button>`;
    this.querySelector("button").addEventListener("click", () => {
      if (!id) return;
      window.dispatchEvent(new CustomEvent("collection:delete", { detail: { id } }));
    });
  }
}
customElements.define("collection-delete", CollectionDelete);


function escapeHtml(str) {
  return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}