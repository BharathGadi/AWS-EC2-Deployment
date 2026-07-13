const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Hello from EC2 Demo Backend 🚀",
  });
});

// API route
app.get("/api", (req, res) => {
  res.json({
    success: true,
    data: {
      name: "Bharath",
      role: "Frontend Developer",
      learning: "AWS EC2",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
