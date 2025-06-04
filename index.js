
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Simple route to log time
app.post("/track", async (req, res) => {
  const { url, duration, user } = req.body;
  const { data, error } = await supabase
    .from("focus_sessions")
    .insert([{ url, duration, user }]);

  if (error) return res.status(500).json({ error });
  res.status(200).json({ success: true, data });
});

app.listen(3000, '0.0.0.0', () => console.log("Backend running on port 3000"));
