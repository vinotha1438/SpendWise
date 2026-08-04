const express = require("express");
const cors = require("cors");

const goalRoutes = require("./routes/goalRoutes");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const recurringRoutes = require("./routes/recurringRoutes");

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", userRoutes);
app.use(expenseRoutes);
app.use(incomeRoutes);
app.use(categoryRoutes);
app.use(budgetRoutes);
app.use(recurringRoutes);
app.use("/goals", goalRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SpendWise Backend is Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});