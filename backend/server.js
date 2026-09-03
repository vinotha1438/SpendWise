const path = require("path");

// .env lives at the project root (one level above backend/), so we
// point dotenv at it explicitly rather than relying on the default
// "./​.env" (which would look inside backend/ and find nothing).
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const { initSocket } = require("./socket");

const goalRoutes = require("./routes/goalRoutes");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const recurringRoutes = require("./routes/recurringRoutes");
const notificationRoutes =
require("./routes/notificationRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transferRoutes = require("./routes/transferRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET || "spendwise_secret_key";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", userRoutes);
app.use(expenseRoutes);
app.use(incomeRoutes);
app.use(categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use(recurringRoutes);
app.use("/goals", goalRoutes);
app.use("/api/notifications",
notificationRoutes);
app.use(accountRoutes);
app.use(transferRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SpendWise Backend is Running 🚀");
});

// Wrap Express in a plain HTTP server so Socket.io can share the
// same port instead of needing a separate one.
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initSocket(io);

io.on("connection", (socket) => {
  // The frontend sends the same JWT it already uses for API calls
  // right after connecting. We verify it here — same as
  // authMiddleware does for HTTP requests — so a socket can only
  // ever join the room for the user it actually belongs to, never
  // an arbitrary user ID a client might claim.
  socket.on("join", (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      socket.join(`user_${decoded.id}`);
    } catch (err) {
      // Invalid/expired token — just don't join any room. The
      // socket stays connected but won't receive personal updates
      // until the user re-authenticates.
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});