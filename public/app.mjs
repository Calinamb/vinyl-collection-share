import UsersViewController from "./controllers/usersController.mjs";
import { get } from "./modules/fetchManager.mjs";
import CollectionsViewController from "./controllers/collectionsViewController.mjs";

const usersContainer = document.querySelector("#users");
const collectionsContainer = document.querySelector("#collection-section");

async function loadUsers() {
    try {
        const users = await get("/users");
        new UsersViewController(usersContainer, users);
    } catch (err) {
        console.error("Feil ved henting av brukere:", err);
    }
}


async function loadCollections() {
    try {
        const collections = await get("/collections");
        new CollectionsViewController(collectionsContainer, collections);
    } catch (err) {
        console.error("Feil ved henting av collections:", err);
    }
}


window.addEventListener("collection:open", async (e) => {
    const { id } = e.detail;

    try {
        const collection = await get(`/collections/${id}`);

       
        console.log("Vis collection:", collection);

    
        alert("Her skal detail view vises for: " + collection.title);

    } catch (err) {
        console.error(err);
    }
});


loadUsers();
loadCollections();