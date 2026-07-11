const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", userRoutes);
app.use("/", expenseRoutes);
console.log("Registering Income Routes...");
app.get("/test123", (req, res) => {
  res.send("TEST OK");
});
app.use("/", incomeRoutes);

app.get("/", (req, res) => {
    res.send("SpendWise Backend is Running 🚀");
});

app.get("/check-income", (req, res) => {
    const incomeController = require("./controllers/incomeController");

    res.send(incomeController.getIncome.toString());
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/income-test", (req, res) => {
  res.send("Income Route Working");
});