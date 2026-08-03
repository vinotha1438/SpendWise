import { useEffect, useState } from "react";
import API from "../../services/api";

function BudgetProgress({ expenses = [] }) {
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

      setBudgets(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold text-slate-800">
        🎯 Budget Progress
      </h2>

      {budgets.length === 0 ? (
        <p className="text-slate-500">
          No Budgets Found
        </p>
      ) : (
        <div className="space-y-6">
          {budgets.map((budget) => {
            const spent = expenses
              .filter(
                (item) => item.category === budget.category
              )
              .reduce(
                (sum, item) =>
                  sum + Number(item.amount || 0),
                0
              );

            const percentage = Math.min(
              (spent / Number(budget.monthly_budget)) * 100,
              100
            );

            const remaining =
              Number(budget.monthly_budget) - spent;

            return (
              <div key={budget.id}>

                <div className="mb-2 flex items-center justify-between">

                  <h3 className="font-semibold text-slate-800">
                    {budget.category}
                  </h3>

                  <span className="font-semibold text-slate-700">
                    ₹{spent.toLocaleString("en-IN")} /
                    ₹{Number(
                      budget.monthly_budget
                    ).toLocaleString("en-IN")}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 100
                        ? "bg-red-500"
                        : percentage >= 75
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

                <div className="mt-2 flex items-center justify-between text-sm">

                  <span
                    className={
                      remaining >= 0
                        ? "text-slate-500"
                        : "font-medium text-red-500"
                    }
                  >
                    {remaining >= 0
                      ? `Remaining ₹${remaining.toLocaleString(
                          "en-IN"
                        )}`
                      : `Over Budget ₹${Math.abs(
                          remaining
                        ).toLocaleString("en-IN")}`}
                  </span>

                  <span className="font-medium text-slate-600">
                    {percentage.toFixed(0)}%
                  </span>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default BudgetProgress;