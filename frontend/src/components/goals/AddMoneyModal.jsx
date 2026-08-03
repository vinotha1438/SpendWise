import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";

function AddMoneyModal({
  open,
  onClose,
  goal,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      return toast.error("Enter a valid amount");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.patch(
        `/goals/add-money/${goal.id}`,
        {
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Money Added Successfully");

      setAmount("");

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add money"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="mb-2 text-2xl font-bold">
          💰 Add Money
        </h2>

        <p className="mb-6 text-slate-500">
          {goal?.goal_name}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="number"
            placeholder="Enter Amount"
            className="w-full rounded-xl border border-slate-300 p-3"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-200 px-5 py-2 hover:bg-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-500 px-5 py-2 text-white hover:bg-emerald-600"
            >
              {loading
                ? "Adding..."
                : "Add Money"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddMoneyModal;