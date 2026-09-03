import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import API from "../services/api";
import { useData } from "../context/DataContext";

import AppLayout from "../components/layout/AppLayout";
import GoalCard from "../components/goals/GoalCard";
import AddGoalModal from "../components/goals/AddGoalModal";
import EditGoalModal from "../components/goals/EditGoalModal";
import AddMoneyModal from "../components/goals/AddMoneyModal";
import GoalHistoryModal from "../components/goals/GoalHistoryModal";

function Goals() {
  const { t } = useTranslation();

  const { refreshData } = useData();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [moneyModalOpen, setMoneyModalOpen] = useState(false);

  const [selectedGoal, setSelectedGoal] = useState(null);

  const [historyOpen, setHistoryOpen] = useState(false);

  const [historyGoal, setHistoryGoal] = useState(null);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/goals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGoals(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const editGoal = (goal) => {
    setSelectedGoal(goal);
    setEditModalOpen(true);
  };

  const addMoney = (goal) => {
    setSelectedGoal(goal);
    setMoneyModalOpen(true);
  };

  const deleteGoal = async (id) => {
    if (!window.confirm(t("confirmDeleteGoal"))) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/goals/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        t("goalDeletedSuccessfully")
      );

      fetchGoals();
      refreshData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t("deleteFailed")
      );
    }
  };

  const showHistory = (goal) => {
    setHistoryGoal(goal);
    setHistoryOpen(true);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-2 sm:px-0">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-800 break-words sm:text-4xl">
              🎯 {t("goals")}
            </h1>

            <p className="mt-1 text-slate-500">
              {t("trackFinancialGoals")}
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 sm:w-auto"
          >
            + {t("addGoal")}
          </button>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-slate-500">
            {t("loadingGoals")}
          </div>
        )}

        {/* NO GOALS */}
        {!loading && goals.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow">

            <h2 className="text-2xl font-bold text-slate-700">
              {t("noGoalsYet")} 🎯
            </h2>

            <p className="mt-3 text-slate-500">
              {t("createFirstSavingsGoal")}
            </p>

          </div>
        )}

        {/* GOALS */}
        {!loading && goals.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={editGoal}
                onDelete={deleteGoal}
                onAddMoney={addMoney}
                onHistory={showHistory}
              />
            ))}

          </div>
        )}

        {/* ADD GOAL MODAL */}
        <AddGoalModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            fetchGoals();
            setOpenModal(false);
          }}
        />

        {/* EDIT GOAL MODAL */}
        <EditGoalModal
          open={editModalOpen}
          goal={selectedGoal}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedGoal(null);
          }}
          onSuccess={() => {
            fetchGoals();
            setEditModalOpen(false);
            setSelectedGoal(null);
          }}
        />

        {/* ADD MONEY MODAL */}
        <AddMoneyModal
          open={moneyModalOpen}
          goal={selectedGoal}
          onClose={() => {
            setMoneyModalOpen(false);
            setSelectedGoal(null);
          }}
          onSuccess={() => {
            fetchGoals();
            setMoneyModalOpen(false);
            setSelectedGoal(null);
          }}
        />

        {/* HISTORY MODAL */}
        <GoalHistoryModal
          open={historyOpen}
          goal={historyGoal}
          onClose={() => {
            setHistoryOpen(false);
            setHistoryGoal(null);
          }}
        />

      </div>
    </AppLayout>
  );
}

export default Goals;