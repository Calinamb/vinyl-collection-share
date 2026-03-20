import { get } from "./modules/fetchManager.mjs";
import CollectionsViewController from "./controllers/collectionsViewController.mjs";

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

window.addEventListener("collection:open", async (e) => {
    const { id } = e.detail;
    try {
        const collection = await get(`/collections/${id}`);
        console.log("Viewing collection:", collection);
        alert("Opening: " + collection.title);
    } catch (err) {
        console.error(err);
    }
});

loadCollections();

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
});