require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// REST API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/providers", require("./routes/providers"));
app.use("/api/requests", require("./routes/requests"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Serve the Phase I frontend too, so http://localhost:5000 opens the website
app.use(express.static(path.join(__dirname, "..")));

// Unknown API route
app.use("/api", (req, res) => res.status(404).json({ message: "API route not found." }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log("LocalHelp running on http://localhost:" + PORT));
});
