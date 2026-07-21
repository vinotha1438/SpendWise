import { useEffect, useState } from "react";
import API from "../../services/api";

function BudgetProgress({ expenses }) {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetchBudgets();
  }, []);

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

  return (
    <div
      style={{
        background: "white",
        borderRadius: "15px",
        padding: "20px",
        marginBottom: "25px",
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>
        🎯 Budget Progress
      </h3>

      {budgets.length === 0 ? (
        <p>No Budgets Found</p>
      ) : (
        budgets.map((budget) => {
          const spent = expenses
            .filter(
              (item) =>
                item.category === budget.category
            )
            .reduce(
              (sum, item) =>
                sum + Number(item.amount),
              0
            );

          const percentage = Math.min(
            (spent / budget.monthly_budget) * 100,
            100
          );

          const remaining =
            budget.monthly_budget - spent;

          return (
            <div
              key={budget.id}
              style={{
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <strong>
                  {budget.category}
                </strong>

                <strong>
                  ₹{spent} / ₹
                  {budget.monthly_budget}
                </strong>
              </div>

              <div
                style={{
                  height: "10px",
                  background: "#E5E7EB",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    background:
                      percentage >= 100
                        ? "#EF4444"
                        : "#22C55E",
                  }}
                />
              </div>

              <small
                style={{
                  color:
                    remaining < 0
                      ? "#EF4444"
                      : "#64748B",
                }}
              >
                {remaining >= 0
                  ? `Remaining ₹${remaining}`
                  : `Over Budget ₹${Math.abs(
                      remaining
                    )}`}
              </small>
            </div>
          );
        })
      )}
    </div>
  );
}

export default BudgetProgress;