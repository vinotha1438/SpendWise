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

      setBudgets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            📅 Budget Planner
          </h1>

          <p className="mt-2 text-slate-500">
            Create and manage your monthly budgets.
          </p>
        </div>

        <BudgetForm onSuccess={fetchBudgets} />

        {budgets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-slate-700">
              No Budgets Found
            </h3>

            <p className="mt-2 text-slate-500">
              Create your first monthly budget.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {budgets.map((budget) => (
              <div
                key={budget.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">
                    {budget.category}
                  </h2>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Budget
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Monthly Budget
                </p>

                <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                  ₹{Number(budget.monthly_budget).toLocaleString("en-IN")}
                </h3>

                <div className="mt-6 border-t pt-4 text-sm text-slate-500">
                  {budget.month}/{budget.year}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  );
}

export default BudgetPlanner;