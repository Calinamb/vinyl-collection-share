import { Router } from "express";
import { randomUUID } from "crypto";

export function createCollectionsRouter(collections) {
  const router = Router();

  // POST /collections
  router.post("/", (req, res) => {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const collection = {
      id: randomUUID(),
      title,
      description: description || "",
      createdAt: new Date().toISOString(),
      albums: [],
    };

    collections.push(collection);
    res.status(201).json(collection);
  });

  // GET /collections/:id
  router.get("/:id", (req, res) => {
    const { id } = req.params;

    const collection = collections.find((c) => c.id === id);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    res.json(collection);
  });

  // (valgfritt, men ofte nyttig) GET /collections
  router.get("/", (req, res) => {
    res.json(collections);
  });

  // (valgfritt) DELETE /collections/:id
  router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const index = collections.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Collection not found" });
    }

    collections.splice(index, 1);
    res.status(204).end();
  });

  return router;
}