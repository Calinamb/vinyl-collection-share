import { Router } from "express";
import { query } from "../db.mjs";

export function createUsersRouter() {
  const router = Router();


  router.post("/", async (req, res) => {
    const { username, password, consent } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    try {
      const result = await query(
        "INSERT INTO users (username, password, consent) VALUES ($1, $2, $3) RETURNING id, username",
        [username, password, consent]
      );
      console.log("User created successfully:", result.rows[0]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ error: "Could not create user. Username might be taken." });
    }
  });


  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {

      const result = await query("SELECT * FROM users WHERE username = $1", [username]);

      if (result.rows.length > 0) {
        const user = result.rows[0];

        if (user.password === password) {
          console.log("Login successful for:", username);
          return res.status(200).json({ 
            message: "Login successful", 
            user: { id: user.id, username: user.username } 
          });
        }
      }

     
      res.status(401).json({ error: "Invalid username or password" });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Server error during login" });
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