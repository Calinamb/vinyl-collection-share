
import express from "express";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { createUsersRouter } from "./routes/usersRoutes.mjs";
import { createCollectionsRouter } from "./routes/collectionsRoutes.mjs";




const app = express();
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "../public")));

// In-memory "database"
const collections = [];

// Mount routers
app.use("/users", createUsersRouter());
app.use("/collections", createCollectionsRouter(collections));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});