import { useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

function IncomeForm({
  incomeToEdit = null,
  onSuccess = () => {},
}) {
  const isEdit = !!incomeToEdit;

  const [title, setTitle] = useState(incomeToEdit?.title || "");
  const [amount, setAmount] = useState(incomeToEdit?.amount || "");
  const [category, setCategory] = useState(incomeToEdit?.category || "");
  const [paymentMethod, setPaymentMethod] = useState(
    incomeToEdit?.payment_method || ""
  );

  const [incomeDate, setIncomeDate] = useState(
    incomeToEdit?.income_date
      ? incomeToEdit.income_date.substring(0, 10)
      : ""
  );

  const [notes, setNotes] = useState(
    incomeToEdit?.notes || ""
  );

  const handleSubmit = async () => {
    if (
      !title ||
      !amount ||
      !category ||
      !paymentMethod ||
      !incomeDate
    ) {
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
        income_date: incomeDate,
        notes,
      };

      let response;

      if (isEdit) {
        response = await API.put(
          `/income/${incomeToEdit.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await API.post(
          "/income",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success(
        response.data.message || "Income Saved Successfully"
      );

      if (!isEdit) {
        setTitle("");
        setAmount("");
        setCategory("");
        setPaymentMethod("");
        setIncomeDate("");
        setNotes("");
      }

      onSuccess();

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to save income"
      );
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

      <select
        className="w-full rounded-lg border p-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="Salary">💵 Salary</option>
        <option value="Business">🏢 Business</option>
        <option value="Freelance">💻 Freelance</option>
        <option value="Investment">📈 Investment</option>
        <option value="Gift">🎁 Gift</option>
        <option value="Other">📦 Other</option>
      </select>

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

      <input
        type="date"
        className="w-full rounded-lg border p-2"
        value={incomeDate}
        onChange={(e) => setIncomeDate(e.target.value)}
      />

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