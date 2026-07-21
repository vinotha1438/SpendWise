import { useEffect, useState } from "react";
import API from "../services/api";

import AppLayout from "../components/layout/AppLayout";
import BudgetForm from "../components/budget/BudgetForm";

function BudgetPlanner() {
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/budgets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBudgets(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <AppLayout>
      <div
        style={{
          padding: "20px",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: "5px",
          }}
        >
          📅 Budget Planner
        </h1>

        <p
          style={{
            color: "#94A3B8",
            marginBottom: "25px",
          }}
        >
          Create and manage your monthly budgets.
        </p>

        <BudgetForm
          onSuccess={fetchBudgets}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
          }}
        >
          {budgets.map((budget) => (
            <div
              key={budget.id}
              style={{
                background: "#111827",
                border: "1px solid #1F2937",
                borderRadius: "15px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  color: "white",
                  marginBottom: "10px",
                }}
              >
                {budget.category}
              </h3>

              <p
                style={{
                  color: "#94A3B8",
                }}
              >
                Monthly Budget
              </p>

              <h2
                style={{
                  color: "#22C55E",
                  marginTop: "10px",
                }}
              >
                ₹{Number(
                  budget.monthly_budget
                ).toLocaleString()}
              </h2>

              <div
                style={{
                  marginTop: "15px",
                  color: "#64748B",
                  fontSize: "14px",
                }}
              >
                {budget.month}/{budget.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default BudgetPlanner;