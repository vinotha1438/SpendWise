import { useState } from "react";
import CategorySelect from "./CategorySelect";
import PaymentSelect from "./PaymentSelect";
import API from "../../services/api";

function ExpenseForm() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.post(
        "/expenses",
        {
          title,
          amount,
          category,
          payment_method: paymentMethod,
          expense_date: expenseDate,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      // Clear form after successful save
      setTitle("");
      setAmount("");
      setCategory("");
      setPaymentMethod("");
      setExpenseDate("");
      setNotes("");

    } catch (error) {
      console.log("Error=",error);
      console.log("Response=",error.response);
      console.log("Request=",error.request);
      console.log("Message=",error.message);

      alert("Failed to save expense");
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
        Save Expense
      </button>
    </div>
  );
}

export default ExpenseForm;