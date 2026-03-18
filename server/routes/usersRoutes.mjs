import { Router } from "express";
import { randomUUID } from "crypto";
import { pool } from "../db.mjs";

export function createUsersRouter() {
  const router = Router();


  router.post("/", async (req, res) => {
    const { username, consent } = req.body;

    if (!username || consent !== true) {
      return res.status(400).json({ error: "Username and consent are required" });
    }

    const id = randomUUID();

    const result = await pool.query(
      `INSERT INTO users (id, username, consent)
       VALUES ($1, $2, $3)
       RETURNING id, username, consent, created_at`,
      [id, username, consent]
    );

    const u = result.rows[0];
    res.status(201).json({
      id: u.id,
      username: u.username,
      consent: u.consent,
      createdAt: u.created_at,
    });
  });

  router.get("/", async (req, res) => {
    const result = await pool.query(
      `SELECT id, username, consent, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json(
      result.rows.map((u) => ({
        id: u.id,
        username: u.username,
        consent: u.consent,
        createdAt: u.created_at,
      }))
    );
  });


  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).end();
  });

  return router;
}