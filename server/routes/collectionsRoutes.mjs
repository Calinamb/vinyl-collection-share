import { Router } from "express";
import { validateCollection } from "../middelwear/validateCollection.js"; 
import { query } from "../db.mjs";

export function createCollectionsRouter() {
  const router = Router();

  router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await query(
        "SELECT * FROM collections WHERE user_id = $1 ORDER BY created_at DESC", 
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching collections:", err);
      res.status(500).json({ error: "Could not fetch collections from database" });
    }
  });

  router.post("/", validateCollection, async (req, res) => {
    const { title, userId } = req.body; 
    try {
      const result = await query(
        "INSERT INTO collections (title, user_id) VALUES ($1, $2) RETURNING *",
        [title, userId]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error saving collection:", err);
      res.status(500).json({ error: "Could not save collection to database" });
    }
  });


  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await query("DELETE FROM collections WHERE id = $1", [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting collection:", err);
      res.status(500).json({ error: "Could not delete collection" });
    }
  });

  return router;
}