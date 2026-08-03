import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";

function AddGoalModal({ open, onClose, onSuccess }) {
  const [goal_name, setGoalName] = useState("");
  const [target_amount, setTargetAmount] = useState("");
  const [target_date, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!goal_name || !target_amount || !target_date) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/goals",
        {
          goal_name,
          target_amount,
          target_date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Goal Created Successfully");

      setGoalName("");
      setTargetAmount("");
      setTargetDate("");

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

        <h2 className="text-2xl font-bold mb-6">
          🎯 Add Savings Goal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Goal Name"
            className="w-full border rounded-xl p-3"
            value={goal_name}
            onChange={(e) => setGoalName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Target Amount"
            className="w-full border rounded-xl p-3"
            value={target_amount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />

          <input
            type="date"
            className="w-full border rounded-xl p-3"
            value={target_date}
            onChange={(e) => setTargetDate(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {loading ? "Saving..." : "Save Goal"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddGoalModal;