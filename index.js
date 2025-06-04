
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date().toISOString() });
});

// Simple route to log time (without Supabase for now)
app.post("/track", async (req, res) => {
  const { url, duration, user } = req.body;
  console.log(`Tracking data received: URL=${url}, Duration=${duration}s, User=${user}`);
  
  // For now, just return success - you can add database later
  res.status(200).json({ 
    success: true, 
    message: "Data received and logged",
    data: { url, duration, user, timestamp: new Date().toISOString() }
  });
});

app.listen(5000, '0.0.0.0', () => console.log("Backend running on port 5000"));
