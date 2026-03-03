import { get } from "./modules/fetchManager.mjs";
import { UsersController } from "./controllers/usersController.mjs";

const users = await get("/users");
new UsersController(document.querySelector("#users"), users);