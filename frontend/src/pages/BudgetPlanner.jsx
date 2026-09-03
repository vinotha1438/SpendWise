import { useEffect, useState } from "react";
import API from "../services/api";
import { useTranslation } from "react-i18next";

import AppLayout from "../components/layout/AppLayout";
import BudgetForm from "../components/budget/BudgetForm";

function BudgetPlanner() {
  const { t } = useTranslation();

  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/api/budgets", {
        headers: {
          Authorization: `Bearer ${ token } `,
        },
      });

      setBudgets(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleEdit = (budget) => {
    setEditingBudget(budget);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDeleteBudget"))) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/ api / budgets / ${ id } `, {
        headers: {
          Authorization: `Bearer ${ token } `,
        },
      });

      fetchBudgets();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          t("deleteFailed")
      );
    }
  };

  return (
    <AppLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            📅 {t("budgetPlanner")}
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {t("createManageMonthlyBudgets")}
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <BudgetForm
            budget={editingBudget}
            isEdit={!!editingBudget}
            onSuccess={() => {
              setEditingBudget(null);
              fetchBudgets();
            }}
          />
        </div>

        {budgets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              {t("noBudgetsFound")}
            </h3>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t("createFirstMonthlyBudget")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {budgets.map((budget) => (
              <div
                key={budget.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {budget.category}
                  </h2>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                    {t("budget")}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  {t("monthlyBudget")}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                  ₹
                  {Number(
                    budget.monthly_budget
                  ).toLocaleString("en-IN")}
                </h3>

                <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                  {budget.month}/{budget.year}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="flex-1 rounded-xl bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600"
                  >
                    {t("edit")}
                  </button>

                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="flex-1 rounded-xl bg-red-500 py-2 font-semibold text-white hover:bg-red-600"
                  >
                    {t("delete")}
                  </button>
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