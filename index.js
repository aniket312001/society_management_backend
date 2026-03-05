const express = require("express");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port 3000");
});