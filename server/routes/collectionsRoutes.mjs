import { Router } from "express";
import { validateCollection } from "../middelwear/validateCollection.js"; 
import { query } from "../db.mjs";

export function createCollectionsRouter() {
  const router = Router();

  router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await query(
        `SELECT c.*, COUNT(a.id) AS album_count 
         FROM collections c
         LEFT JOIN albums a ON c.id = a.collection_id
         WHERE c.user_id = $1
         GROUP BY c.id
         ORDER BY c.created_at DESC`, 
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching collections:", err);
      res.status(500).json({ error: "Could not fetch collections" });
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
      res.status(500).json({ error: "Could not save collection" });
    }
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await query("DELETE FROM collections WHERE id = $1", [id]);
      res.status(204).end();
    } catch (err) {
      console.error("Error deleting collection:", err);
      res.status(500).json({ error: "Could not delete collection" });
    }
  });

  router.get("/:id/albums", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await query(
        "SELECT * FROM albums WHERE collection_id = $1 ORDER BY created_at ASC",
        [id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching albums:", err);
      res.status(500).json({ error: "Could not fetch albums" });
    }
  });

  router.post("/:id/albums", async (req, res) => {
    const { id } = req.params;
    const { artist, title } = req.body;
    try {
      const result = await query(
        "INSERT INTO albums (collection_id, artist, title) VALUES ($1, $2, $3) RETURNING *",
        [id, artist, title]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error saving album:", err);
      res.status(500).json({ error: "Could not save album" });
    }
  });

  return router;
}