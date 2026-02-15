import UsersViewController from "./controllers/usersController.mjs";
import { get } from "./modules/fetchManager.mjs";

const users = await get("/users");

new UsersViewController(
  document.querySelector("#users"),
  users
);
