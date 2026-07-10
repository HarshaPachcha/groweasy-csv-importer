require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Routes
const uploadRoutes = require("./routes/uploadRoutes");
const importRoutes = require("./routes/importRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/upload", uploadRoutes);
app.use("/import", importRoutes);

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "GrowEasy Backend Running 🚀"
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});