import { useEffect, useState } from "react";
import API from "../../services/api";
import { useTranslation } from "react-i18next";

function RecurringForm({
  recurringExpense = null,
  isEdit = false,
  onSuccess,
}) {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [frequency, setFrequency] = useState("Monthly");
  const [nextDueDate, setNextDueDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (recurringExpense) {
      setTitle(recurringExpense.title || "");
      setCategory(recurringExpense.category || "");
      setAmount(recurringExpense.amount || "");
      setPaymentMethod(
        recurringExpense.payment_method || "Cash"
      );
      setFrequency(
        recurringExpense.frequency || "Monthly"
      );
      setNextDueDate(
        recurringExpense.next_due_date
          ? recurringExpense.next_due_date.split("T")[0]
          : ""
      );
      setNotes(recurringExpense.notes || "");
    } else {
      setTitle("");
      setCategory("");
      setAmount("");
      setPaymentMethod("Cash");
      setFrequency("Monthly");
      setNextDueDate("");
      setNotes("");
    }
  }, [recurringExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !amount || !nextDueDate) {
      alert(t("pleaseFillAllFields"));
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const data = {
        title,
        category,
        amount,
        payment_method: paymentMethod,
        frequency,
        next_due_date: nextDueDate,
        notes,
      };

      if (isEdit) {
        await API.put(
          `/recurring-expenses/${recurringExpense.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(t("recurringExpenseUpdatedSuccessfully"));
      } else {
        await API.post(
          "/recurring-expenses",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(t("recurringExpenseAddedSuccessfully"));
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          t("somethingWentWrong")
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold">
        {isEdit
          ? t("editRecurringExpense")
          : t("addRecurringExpense")}
      </h2>

      <input
        type="text"
        placeholder={t("title")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <input
        type="text"
        placeholder={t("category")}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <input
        type="number"
        placeholder={t("amount")}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <select
        value={paymentMethod}
        onChange={(e) =>
          setPaymentMethod(e.target.value)
        }
        className="w-full rounded-xl border p-3"
      >
        <option value="Cash">{t("cash")}</option>
        <option value="UPI">{t("upi")}</option>
        <option value="Card">{t("card")}</option>
        <option value="Bank Transfer">
          {t("bankTransfer")}
        </option>
      </select>

      <select
        value={frequency}
        onChange={(e) =>
          setFrequency(e.target.value)
        }
        className="w-full rounded-xl border p-3"
      >
        <option value="Weekly">{t("weekly")}</option>
        <option value="Monthly">{t("monthly")}</option>
        <option value="Yearly">{t("yearly")}</option>
      </select>

      <input
        type="date"
        value={nextDueDate}
        onChange={(e) =>
          setNextDueDate(e.target.value)
        }
        className="w-full rounded-xl border p-3"
      />

      <textarea
        placeholder={t("notes")}
        rows="3"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
      >
        {isEdit
          ? t("updateRecurringExpense")
          : t("saveRecurringExpense")}
      </button>
    </form>
  );
}

export default RecurringForm;