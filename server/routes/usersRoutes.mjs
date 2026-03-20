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
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ error: "Could not create user. Username might be taken." });
    }
  });


router.post("/", async (req, res) => {
 
  const { username, password, consent } = req.body; 

  try {
    
    const result = await query(
      "INSERT INTO users (username, password, consent) VALUES ($1, $2, $3) RETURNING id, username",
      [username, password, consent]
    );
    
    console.log("User created successfully:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Could not create user: " + err.message });
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

