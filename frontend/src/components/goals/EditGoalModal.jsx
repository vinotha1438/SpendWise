import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";

function EditGoalModal({
  open,
  onClose,
  goal,
  onSuccess,
}) {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setGoalName(goal.goal_name || "");
      setTargetAmount(goal.target_amount || "");

      if (goal.target_date) {
        setTargetDate(
          new Date(goal.target_date)
            .toISOString()
            .split("T")[0]
        );
      }
    }
  }, [goal]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!goalName || !targetAmount || !targetDate) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.put(
        `/goals/${goal.id}`,
        {
          goal_name: goalName,
          target_amount: Number(targetAmount),
          target_date: targetDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Goal Updated");

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-2xl bg-white p-6">

        <h2 className="mb-6 text-2xl font-bold">
          ✏️ Edit Goal
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            className="w-full rounded-xl border p-3"
            placeholder="Goal Name"
            value={goalName}
            onChange={(e) =>
              setGoalName(e.target.value)
            }
          />

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            placeholder="Target Amount"
            value={targetAmount}
            onChange={(e) =>
              setTargetAmount(e.target.value)
            }
          />

          <input
            type="date"
            className="w-full rounded-xl border p-3"
            value={targetDate}
            onChange={(e) =>
              setTargetDate(e.target.value)
            }
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-200 px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-500 px-5 py-2 text-white"
            >
              {loading
                ? "Updating..."
                : "Update Goal"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditGoalModal;