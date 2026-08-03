import { useEffect, useState } from "react";
import API from "../services/api";

import AppLayout from "../components/layout/AppLayout";
import RecurringForm from "../components/recurring/RecurringForm";
import RecurringTable from "../components/recurring/RecurringTable";

function RecurringExpenses() {
  const [recurringExpenses, setRecurringExpenses] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingExpense, setEditingExpense] =
    useState(null);

  const fetchRecurringExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        "/recurring-expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecurringExpenses(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecurringExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this recurring expense?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.delete(
        `/recurring-expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRecurringExpenses();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  return (
    <AppLayout>
      <div className="p-6">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              🔁 Recurring Expenses
            </h1>

            <p className="text-slate-500 mt-2">
              Manage your monthly and yearly
              recurring expenses.
            </p>

          </div>

          <button
            onClick={() => {
              setEditingExpense(null);
              setShowForm(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            + Add Recurring Expense
          </button>

        </div>

        {showForm && (
          <div className="mb-8">

            <RecurringForm
              recurringExpense={editingExpense}
              isEdit={!!editingExpense}
              onSuccess={() => {
                setShowForm(false);
                setEditingExpense(null);
                fetchRecurringExpenses();
              }}
            />

          </div>
        )}

        <RecurringTable
          recurringExpenses={recurringExpenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>
    </AppLayout>
  );
}

export default RecurringExpenses;