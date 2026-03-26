import { get } from "./modules/fetchManager.mjs";
import CollectionsViewController from "./controllers/collectionsViewController.mjs";
import { t, getLang } from './modules/i18n.mjs';

if ("serviceWorker" in navigator) {
  const isLocal = /127\.0\.0\.1|localhost/.test(location.hostname);
  if (!isLocal) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/serviceWorker.js")
        .then(r => console.log("Service Worker registered:", r.scope))
        .catch(err => console.log("Service Worker failed:", err));
    });
  } else {
    navigator.serviceWorker.getRegistrations?.().then(rs => rs.forEach(r => r.unregister()));
  }
}

const userId = localStorage.getItem("userId");
if (!userId) {
  window.location.href = "index.html";
}

const collectionsContainer = document.querySelector("#collection-section");

async function loadCollections() {
  try {
    const collections = await get(`/collections/user/${userId}`);
    new CollectionsViewController(collectionsContainer, collections);
  } catch (err) {
    console.error("Error fetching collections:", err);
  }
}

loadCollections();

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
});


document.documentElement.lang = getLang();