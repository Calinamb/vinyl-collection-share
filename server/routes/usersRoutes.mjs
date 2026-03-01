import { Router } from "express";
import { randomUUID } from "crypto";

export function createUsersRouter(users) {
  const router = Router();

  // POST /users
  router.post("/", (req, res) => {
    const { username, consent } = req.body;

    if (!username || consent !== true) {
      return res.status(400).json({
        error: "Username and consent are required",
      });
    }

    const user = {
      id: randomUUID(),
      username,
      consent,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    res.status(201).json(user);
  });

  // (DEV) GET /users
  router.get("/", (req, res) => {
    res.json(users);
  });

  // DELETE /users/:id
  router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users.splice(index, 1);
    res.status(204).end();
  });

  return router;
}