
import express from "express";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));


const users = [];
const collections = [];

console.log("Server scaffold running");

app.post("/users", (req, res) => {
  const { username, consent } = req.body;

  if (!username || consent !== true) {
    return res.status(400).json({
      error: "Username and consent are required"
    });
  }
  
  const user = {
    id: randomUUID(),
    username,

    consent,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  res.status(201).json(user);
});

app.get("/users", (req, res) => {
  res.json(users);
});




app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const index = users.findIndex(user => user.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(index, 1);
  res.status(204).end();
});

app.post("/collections", (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const collection = {
    id: randomUUID(),
    title,
    description: description || "",
    createdAt: new Date().toISOString(),
    albums: []
  };

  collections.push(collection);
  res.status(201).json(collection);
});

app.get("/collections/:id", (req, res) => {
  const { id } = req.params;

  const collection = collections.find(c => c.id === id);

  if (!collection) {
    return res.status(404).json({ error: "Collection not found" });
  }

  res.json(collection);
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
}); 
