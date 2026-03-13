import { Router } from "express";
import { randomUUID } from "crypto";
import { validateCollection } from "../middleware/validateCollection.js"; 

export function createCollectionsRouter(collections) {
  const router = Router();

 
  router.post("/", validateCollection, (req, res) => {
    const { title, description } = req.body;

   

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


  router.get("/:id", (req, res) => {
    const { id } = req.params;
    const collection = collections.find((c) => c.id === id);
    
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }
    res.json(collection);
  });


  router.get("/", (req, res) => {
    res.json(collections);
  });


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