import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import BudgetPlanner from "./pages/BudgetPlanner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/income" element={<Income />} />

        <Route
          path="/budget"
          element={<BudgetPlanner />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;