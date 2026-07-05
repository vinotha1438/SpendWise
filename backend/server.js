const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", userRoutes);
app.use("/", expenseRoutes);

app.get("/", (req, res) => {
    res.send("SpendWise Backend is Running 🚀");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});