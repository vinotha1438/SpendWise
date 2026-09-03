import { useEffect, useState } from "react";
import API from "../services/api";
import { useTranslation } from "react-i18next";

import AppLayout from "../components/layout/AppLayout";
import RecurringForm from "../components/recurring/RecurringForm";
import RecurringTable from "../components/recurring/RecurringTable";

function RecurringExpenses() {
  const { t } = useTranslation();

  const [recurringExpenses, setRecurringExpenses] =
    useState([]);

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
        t("confirmDeleteRecurring")
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
          t("deleteFailed")
      );
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="break-words text-3xl font-bold text-slate-800 sm:text-4xl">
              🔁 {t("recurringExpenses")}
            </h1>

            <p className="mt-2 text-slate-500">
              {t("manageRecurringExpenses")}
            </p>
          </div>

          <button
            onClick={() => {
              setEditingExpense(null);
              setShowForm(true);
            }}
            className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            + {t("addRecurringExpense")}
          </button>

        </div>

        {showForm && (
          <div className="mb-8 overflow-hidden rounded-2xl">

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