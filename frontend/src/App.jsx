import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import BudgetPlanner from "./pages/BudgetPlanner";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Goals from "./pages/Goals";
import RecurringExpenses from "./pages/RecurringExpenses";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/income"
          element={<Income />}
        />

        <Route
          path="/budget"
          element={<BudgetPlanner />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/goals"
          element={<Goals />}
        />

        <Route
          path="/recurring-expenses"
          element={<RecurringExpenses />}
        />
      </Routes>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </BrowserRouter>
  );
}

export default App;