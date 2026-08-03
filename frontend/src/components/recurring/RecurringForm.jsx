import { useEffect, useState } from "react";
import API from "../../services/api";

function RecurringForm({
  recurringExpense = null,
  isEdit = false,
  onSuccess,
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Cash");
  const [frequency, setFrequency] =
    useState("Monthly");
  const [nextDueDate, setNextDueDate] =
    useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (recurringExpense) {
      setTitle(recurringExpense.title);
      setCategory(recurringExpense.category);
      setAmount(recurringExpense.amount);
      setPaymentMethod(
        recurringExpense.payment_method
      );
      setFrequency(recurringExpense.frequency);
      setNextDueDate(
        recurringExpense.next_due_date
          ?.split("T")[0]
      );
      setNotes(recurringExpense.notes || "");
    }
  }, [recurringExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !category ||
      !amount ||
      !nextDueDate
    ) {
      alert("Please fill all fields");
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

        alert(
          "Recurring Expense Updated Successfully"
        );
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

        alert(
          "Recurring Expense Added Successfully"
        );
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold">
        {isEdit
          ? "Edit Recurring Expense"
          : "Add Recurring Expense"}
      </h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        className="w-full border rounded-xl p-3"
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
        className="w-full border rounded-xl p-3"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
        className="w-full border rounded-xl p-3"
      />

      <select
        value={paymentMethod}
        onChange={(e) =>
          setPaymentMethod(e.target.value)
        }
        className="w-full border rounded-xl p-3"
      >
        <option>Cash</option>
        <option>UPI</option>
        <option>Card</option>
        <option>Bank Transfer</option>
      </select>

      <select
        value={frequency}
        onChange={(e) =>
          setFrequency(e.target.value)
        }
        className="w-full border rounded-xl p-3"
      >
        <option>Weekly</option>
        <option>Monthly</option>
        <option>Yearly</option>
      </select>

      <input
        type="date"
        value={nextDueDate}
        onChange={(e) =>
          setNextDueDate(e.target.value)
        }
        className="w-full border rounded-xl p-3"
      />

      <textarea
        placeholder="Notes"
        rows="3"
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
        className="w-full border rounded-xl p-3"
      />

      <button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition"
      >
        {isEdit
          ? "Update Recurring Expense"
          : "Save Recurring Expense"}
      </button>
    </form>
  );
}

export default RecurringForm;