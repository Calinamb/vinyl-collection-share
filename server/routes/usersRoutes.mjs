import { Router } from "express";
import { query } from "../db.mjs";
import bcrypt from "bcrypt";
import { t } from "../i18n.mjs";

const SALT_ROUNDS = 10;

export function createUsersRouter() {
  const router = Router();

  router.post("/", async (req, res) => {
    const { username, password, consent } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: t(req, "error_username_required") });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const result = await query(
        "INSERT INTO users (username, password, consent) VALUES ($1, $2, $3) RETURNING id, username",
        [username, hashedPassword, consent]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ error: t(req, "error_could_not_create_user") });
    }
  });

  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      const result = await query("SELECT * FROM users WHERE username = $1", [username]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          return res.status(200).json({
            message: "Login successful",
            user: { id: user.id, username: user.username }
          });
        }
      }

      res.status(401).json({ error: t(req, "error_login_failed") });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: t(req, "error_login_server") });
    }
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: t(req, "error_user_not_found") });
      }

      res.status(204).end();
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({ error: t(req, "error_delete_user") });
    }
  });

  router.get("/check-database", async (req, res) => {
    try {
      const result = await query("SELECT id, username, password FROM users");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}