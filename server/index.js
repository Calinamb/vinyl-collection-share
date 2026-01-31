
import express from "express";
import { randomUUID } from "crypto";

const app = express();
app.use(express.json());

const users = [];
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


app.listen(3000, () => {
 
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const index = users.findIndex(user => user.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  users.splice(index, 1);

  res.status(204).end();
});


