// server/index.js
 import express from "express";

const app = express();
const port = process.env.PORT || 3000;

// Example route
app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
