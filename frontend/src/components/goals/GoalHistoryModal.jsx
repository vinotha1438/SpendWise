import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import { useData } from "../../context/DataContext";

function GoalHistoryModal({
  open,
  goal,
  onClose,
}) {
  const { refreshData } = useData();

  const [history, setHistory] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    if (!goal) return;

    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        `/goals/${goal.id}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to load history");
    }
  };


  useEffect(() => {
    if (open && goal) {
      fetchHistory();
    }
  }, [open, goal]);


  const handleDelete = async (historyId) => {
    const confirmDelete = window.confirm(
      "Remove this amount from the goal?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(historyId);

      const token = localStorage.getItem("token");

      await API.delete(
        `/goals/history/${historyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Money Removed Successfully"
      );

      // Backend restored the account balance for this entry —
      // refresh the shared context so Sidebar/Dashboard/Accounts
      // reflect it too.
      refreshData();

      // Refresh history
      fetchHistory();

      // Close modal so Goals page refreshes
      onClose();

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to remove money"
      );
    } finally {
      setDeletingId(null);
    }
  };


  if (!open) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-slate-800">
            Goal History
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg bg-red-500 px-3 py-2 font-semibold text-white hover:bg-red-600"
          >
            X
          </button>

        </div>


        {/* History */}

        {history.length === 0 ? (

          <div className="py-10 text-center text-slate-500">
            No History Found
          </div>

        ) : (

          <div className="max-h-[400px] space-y-3 overflow-y-auto">

            {history.map((item) => (

              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >

                <div>

                  <h3 className="font-bold text-emerald-600">
                    +₹
                    {Number(
                      item.amount
                    ).toLocaleString("en-IN")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(
                      item.created_at
                    ).toLocaleString("en-IN")}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.account_name
                      ? `From ${item.account_name}`
                      : "No account linked"}
                  </p>

                </div>


                {/* Delete */}

                <button
                  onClick={() =>
                    handleDelete(item.id)
                  }
                  disabled={
                    deletingId === item.id
                  }
                  className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === item.id
                    ? "..."
                    : "Delete"}
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default GoalHistoryModal;