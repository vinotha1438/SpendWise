import { useState } from "react";
import CategorySelect from "./CategorySelect";
import PaymentSelect from "./PaymentSelect";
import API from "../../services/api";
import { useData } from "../../context/DataContext";

function ExpenseForm({
  expense = null,
  isEdit = false,
  onSuccess = () => {},
}) {
  const { accounts } = useData();

  const [title, setTitle] = useState(expense?.title || "");
  const [amount, setAmount] = useState(expense?.amount || "");
  const [whereToPay, setWhereToPay] = useState(expense?.where_to_pay || "");
  const [category, setCategory] = useState(expense?.category || "");
  const [paymentMethod, setPaymentMethod] = useState(expense?.payment_method || "");
  const [accountId, setAccountId] = useState(expense?.account_id || "");

  const [expenseDate, setExpenseDate] = useState(
    expense?.expense_date ? expense.expense_date.substring(0, 10) : ""
  );

  const [notes, setNotes] = useState(expense?.notes || "");

  const handleSubmit = async () => {
    if (
      !title || !amount || !whereToPay || !category ||
      !paymentMethod || !accountId || !expenseDate
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const data = {
        title,
        amount: Number(amount),
        where_to_pay: whereToPay,
        category,
        payment_method: paymentMethod,
        account_id: Number(accountId),
        expense_date: expenseDate,
        notes,
      };

      let response;

      if (isEdit) {
        response = await API.put(`/expenses/${expense.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await API.post("/expenses", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      alert(response.data.message);

      if (!isEdit) {
        setTitle("");
        setAmount("");
        setWhereToPay("");
        setCategory("");
        setPaymentMethod("");
        setAccountId("");
        setExpenseDate("");
        setNotes("");
      }

      onSuccess();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to save expense");
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

      <div>
        <label className="mb-1 block text-sm font-semibold">Paid To</label>
        <input
          type="text"
          placeholder="e.g. Rent, Amazon, Swiggy, Electricity, John"
          className="w-full border rounded-lg p-2"
          value={whereToPay}
          onChange={(e) => setWhereToPay(e.target.value)}
        />
      </div>

      <CategorySelect value={category} onChange={(e) => setCategory(e.target.value)} />

      <PaymentSelect value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />

      <div>
        <label className="mb-1 block text-sm font-semibold">Account</label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.account_name} — ₹
              {Number(account.current_balance || 0).toLocaleString("en-IN")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold">Expense Date</label>
        <div className="relative">
          <input
            type="date"
            className="w-full border rounded-lg p-2"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
          {!expenseDate && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              dd-mm-yyyy
            </span>
          )}
        </div>
      </div>

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