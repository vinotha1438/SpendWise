import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";

import AppLayout from "../components/layout/AppLayout";
import GoalCard from "../components/goals/GoalCard";
import AddGoalModal from "../components/goals/AddGoalModal";
import EditGoalModal from "../components/goals/EditGoalModal";
import AddMoneyModal from "../components/goals/AddMoneyModal";

function Goals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);

    const [editModalOpen, setEditModalOpen] =
        useState(false);

    const [moneyModalOpen, setMoneyModalOpen] =
        useState(false);

    const [selectedGoal, setSelectedGoal] =
        useState(null);

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
        if (
            !window.confirm(
                "Delete this goal?"
            )
        )
            return;

        try {
            const token = localStorage.getItem("token");

            await API.delete(`/goals/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success(
                "Goal Deleted Successfully"
            );

            fetchGoals();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Delete Failed"
            );
        }
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-slate-800">
                            🎯 Savings Goals
                        </h1>

                        <p className="mt-1 text-slate-500">
                            Track your financial goals
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            setOpenModal(true)
                        }
                        className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600"
                    >
                        + Add Goal
                    </button>

                </div>

                {loading && (
                    <div className="py-20 text-center text-slate-500">
                        Loading goals...
                    </div>
                )}

                {!loading &&
                    goals.length === 0 && (
                        <div className="rounded-2xl bg-white p-12 text-center shadow">

                            <h2 className="text-2xl font-bold text-slate-700">
                                No Goals Yet 🎯
                            </h2>

                            <p className="mt-3 text-slate-500">
                                Create your first savings
                                goal.
                            </p>

                        </div>
                    )}

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {goals.map((goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onEdit={editGoal}
                            onDelete={deleteGoal}
                            onAddMoney={addMoney}
                        />
                    ))}

                </div>

                <AddGoalModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    onSuccess={() => {
                        fetchGoals();
                        setOpenModal(false);
                    }}
                />

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

            </div>
        </AppLayout>
    );
}

export default Goals;