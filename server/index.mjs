import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createUsersRouter } from "./routes/usersRoutes.mjs";
import { createCollectionsRouter } from "./routes/collectionsRoutes.mjs";
import { t } from "./i18n.mjs";

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static('public'));


app.use("/users", createUsersRouter());
app.use("/collections", createCollectionsRouter());



app.use((err, req, res, next) => {
  console.error("Critical error in server:");
  console.error(err.stack);
  res.status(500).json({ error: t(req, "error_server") });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});