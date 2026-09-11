import { useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useData } from "../../context/DataContext";
import CategorySelect from "./CategorySelect";

function IncomeForm({
  incomeToEdit = null,
  onSuccess = () => {},
}) {
  const isEdit = !!incomeToEdit;
  const { accounts } = useData();

  const [title, setTitle] = useState(incomeToEdit?.title || "");
  const [amount, setAmount] = useState(incomeToEdit?.amount || "");
  const [category, setCategory] = useState(incomeToEdit?.category || "");
  const [paymentMethod, setPaymentMethod] = useState(incomeToEdit?.payment_method || "");
  const [accountId, setAccountId] = useState(incomeToEdit?.account_id || "");

  const [incomeDate, setIncomeDate] = useState(
    incomeToEdit?.income_date ? incomeToEdit.income_date.substring(0, 10) : ""
  );

  const [notes, setNotes] = useState(incomeToEdit?.notes || "");

  const handleSubmit = async () => {
    if (!title || !amount || !category || !paymentMethod || !accountId || !incomeDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const data = {
        title,
        amount: Number(amount),
        category,
        payment_method: paymentMethod,
        account_id: Number(accountId),
        income_date: incomeDate,
        notes,
      };

      let response;

      if (isEdit) {
        response = await API.put(`/income/${incomeToEdit.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await API.post("/income", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success(response.data.message || "Income Saved Successfully");

      if (!isEdit) {
        setTitle("");
        setAmount("");
        setCategory("");
        setPaymentMethod("");
        setAccountId("");
        setIncomeDate("");
        setNotes("");
      }

      onSuccess();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save income");
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <input
        type="text"
        placeholder="Income Title"
        className="w-full rounded-lg border p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        className="w-full rounded-lg border p-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <CategorySelect value={category} onChange={(e) => setCategory(e.target.value)} />

      <select
        className="w-full rounded-lg border p-2"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="">Payment Method</option>
        <option value="Cash">💵 Cash</option>
        <option value="UPI">📱 UPI</option>
        <option value="Bank">🏦 Bank</option>
      </select>

      <div>
        <label className="mb-1 block text-sm font-semibold">Account</label>
        <select
          className="w-full rounded-lg border p-2"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
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
        <label className="mb-1 block text-sm font-semibold">Income Date</label>
        <div className="relative">
          <input
            type="date"
            className="w-full rounded-lg border p-2"
            value={incomeDate}
            onChange={(e) => setIncomeDate(e.target.value)}
          />
          {!incomeDate && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              dd-mm-yyyy
            </span>
          )}
        </div>
      </div>

      <textarea
        placeholder="Notes (Optional)"
        className="w-full rounded-lg border p-2"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 transition"
      >
        {isEdit ? "Update Income" : "Save Income"}
      </button>
    </div>
  );
}

export default IncomeForm;