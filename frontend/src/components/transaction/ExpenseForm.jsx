import { useState } from "react";
import CategorySelect from "./CategorySelect";
import PaymentSelect from "./PaymentSelect";
import API from "../../services/api";

function ExpenseForm({
  expense = null,
  isEdit = false,
  onSuccess = () => {},
}) {
  const [title, setTitle] = useState(expense?.title || "");
  const [amount, setAmount] = useState(expense?.amount || "");
  const [category, setCategory] = useState(expense?.category || "");
  const [paymentMethod, setPaymentMethod] = useState(
    expense?.payment_method || ""
  );
  const [expenseDate, setExpenseDate] = useState(
    expense?.expense_date
      ? expense.expense_date.substring(0, 10)
      : ""
  );
  const [notes, setNotes] = useState(expense?.notes || "");

  const handleSubmit = async () => {
  if (
    !title ||
    !amount ||
    !category ||
    !paymentMethod ||
    !expenseDate
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const data = {
      title,
      amount: Number(amount),
      category,
      payment_method: paymentMethod,
      expense_date: expenseDate,
      notes,
    };

    let response;

    if (isEdit) {
      response = await API.put(
        `/expenses/${expense.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      response = await API.post(
        "/expenses",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    alert(response.data.message);

    if (!isEdit) {
      setTitle("");
      setAmount("");
      setCategory("");
      setPaymentMethod("");
      setExpenseDate("");
      setNotes("");
    }

    onSuccess();
  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      "Failed to save expense"
    );
  }
};

  return (
    <div className="mt-4 space-y-3">

      <input
        type="text"
        placeholder="Expense Title"
        className="w-full border rounded-lg p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        className="w-full border rounded-lg p-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <CategorySelect
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <PaymentSelect
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />

      <input
        type="date"
        className="w-full border rounded-lg p-2"
        value={expenseDate}
        onChange={(e) => setExpenseDate(e.target.value)}
      />

      <textarea
        placeholder="Notes (Optional)"
        className="w-full border rounded-lg p-2"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        className="w-full bg-teal-500 text-white rounded-lg p-2 hover:bg-teal-600"
        onClick={handleSubmit}
      >
        {isEdit ? "Update Expense" : "Save Expense"}
      </button>

    </div>
  );
}

export default ExpenseForm;