import { Router } from "express";
import { validateCollection } from "../middleware/validateCollection.js"; 
import { query } from "../db.mjs";

// Vi fjerner "collections"-parameteren her, siden vi bruker DB nå
export function createCollectionsRouter() {
  const router = Router();

  // 1. HENT ALLE SAMLINGER
  router.get("/", async (req, res) => {
    try {
      const result = await query("SELECT * FROM collections ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      console.error("Feil ved henting:", err);
      res.status(500).json({ error: "Kunne ikke hente samlinger fra databasen" });
    }
  });

  // 2. HENT ÉN SPESIFIKK SAMLING
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await query("SELECT * FROM collections WHERE id = $1", [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Samlingen ble ikke funnet" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Serverfeil ved henting av samling" });
    }
  });

  // 3. OPPRETT NY SAMLING
  router.post("/", validateCollection, async (req, res) => {
    const { title } = req.body; // Vi dropper 'description' hvis du ikke har det i DB-tabellen ennå
    try {
      const result = await query(
        "INSERT INTO collections (title) VALUES ($1) RETURNING *",
        [title]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Feil ved lagring:", err);
      res.status(500).json({ error: "Kunne ikke lagre samlingen i databasen" });
    }
  });

  // 4. SLETT SAMLING
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await query("DELETE FROM collections WHERE id = $1", [id]);
      
      // Sjekk om noe faktisk ble slettet (rowsAffected finnes ikke direkte i pg, men vi kan sjekke result.rowCount)
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Samlingen finnes ikke" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error("Feil ved sletting:", err);
      res.status(500).json({ error: "Kunne ikke slette samlingen" });
    }
  });

  return router;
}