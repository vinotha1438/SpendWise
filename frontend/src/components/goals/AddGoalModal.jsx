import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import API from "../../services/api";

function AddGoalModal({ open, onClose, onSuccess }) {
  const { t } = useTranslation();

  const [goal_name, setGoalName] = useState("");
  const [target_amount, setTargetAmount] = useState("");
  const [target_date, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!goal_name || !target_amount || !target_date) {
      return toast.error(t("pleaseFillAllFields"));
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

      toast.success(t("goalCreatedSuccessfully"));

      setGoalName("");
      setTargetAmount("");
      setTargetDate("");

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t("failedToCreateGoal")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="mb-6 text-2xl font-bold">
          🎯 {t("addSavingsGoal")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder={t("goalName")}
            className="w-full rounded-xl border p-3"
            value={goal_name}
            onChange={(e) =>
              setGoalName(e.target.value)
            }
          />

          <input
            type="number"
            placeholder={t("targetAmount")}
            className="w-full rounded-xl border p-3"
            value={target_amount}
            onChange={(e) =>
              setTargetAmount(e.target.value)
            }
          />

          <input
            type="date"
            className="w-full rounded-xl border p-3"
            value={target_date}
            onChange={(e) =>
              setTargetDate(e.target.value)
            }
          />

          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-200 px-5 py-2 hover:bg-slate-300"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-500 px-5 py-2 text-white hover:bg-emerald-600"
            >
              {loading
                ? t("saving")
                : t("saveGoal")}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddGoalModal;
