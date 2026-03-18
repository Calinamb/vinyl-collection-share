import { Router } from "express";
import { randomUUID } from "crypto";
import { pool } from "../db.mjs";

export function createUsersRouter() {
  const router = Router();


  router.post("/", async (req, res) => {

    const { username, password, consent } = req.body;

    if (!username || !password || consent !== true) {
      return res.status(400).json({ error: "Username, password and consent are required" });
    }

    const id = randomUUID();

    try {
   
      const result = await pool.query(
        `INSERT INTO users (id, username, password, consent)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, consent, created_at`,
        [id, username, password, consent]
      );

      const u = result.rows[0];
      res.status(201).json({
        id: u.id,
        username: u.username,
        consent: u.consent,
        createdAt: u.created_at,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not create user" });
    }
  });


  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    try {

      const result = await pool.query(
        "SELECT id, username, password FROM users WHERE username = $1",
        [username]
      );

      const user = result.rows[0];

   
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      
      res.json({
        message: "Login successful",
        userId: user.id,
        username: user.username
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  });


  router.get("/", async (req, res) => {
    const result = await pool.query(
      `SELECT id, username, consent, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
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