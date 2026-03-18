import "dotenv/config";
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

// 2. Mount routers
app.use("/users", createUsersRouter());
app.use("/collections", createCollectionsRouter()); // La til denne så samlinger fungerer


app.use((err, req, res, next) => {
  console.error("SERVER CRASH DETECTED:");
  console.error(err.stack);
  res.status(500).json({ error: "Something is wrong", message: err.message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});