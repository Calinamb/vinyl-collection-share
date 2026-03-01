
import express from "express";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { createUsersRouter } from "./routes/usersRoutes.mjs";



const app = express();
app.use(express.json());

// ESM-friendly __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve client (public/)
app.use(express.static(path.join(__dirname, "../public")));

// In-memory "database" (scaffold)
const users = [];
const collections = [];

// Mount routers
app.use("/users", createUsersRouter(users));
app.use("/collections", createCollectionsRouter(collections));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});