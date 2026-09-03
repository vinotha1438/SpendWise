import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { useTranslation } from "react-i18next";
import { matchesDateFilter, sortTransactions } from "../utils/dateFilter";

import { useData } from "../context/DataContext";
import AppLayout from "../components/layout/AppLayout";
import AddIncomeModal from "../components/transaction/AddIncomeModal";
import IncomeTable from "../components/transaction/IncomeTable";

function Income() {
  const { t } = useTranslation();

  // Single source of truth — same income array Dashboard, Analytics,
  // Reports etc. all read from. No more local fetch/local state here.
  const { income, refreshData } = useData();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  // Refresh on mount in case this page is opened directly (e.g. via
  // URL/refresh) without visiting Dashboard first.
  useEffect(() => {
    refreshData();
  }, []);

  const filteredIncome = useMemo(() => {
    const filtered = income.filter((item) => {
      const matchSearch = item.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === "" ||
        item.category === selectedCategory;

      const matchDate = matchesDateFilter(
        item.income_date,
        dateFilter
      );

      return matchSearch && matchCategory && matchDate;
    });

    return sortTransactions(filtered, sortBy, "income_date");
  }, [income, search, selectedCategory, dateFilter, sortBy]);

  const totalIncome = filteredIncome.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const today = new Date();

  const todayIncome = filteredIncome
    .filter((item) => {
      if (!item.income_date) return false;

      return (
        new Date(item.income_date).toDateString() ===
        today.toDateString()
      );
    })
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const thisMonthIncome = filteredIncome
    .filter((item) => {
      if (!item.income_date) return false;

      const d = new Date(item.income_date);

      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const averageIncome =
    filteredIncome.length > 0
      ? Math.round(totalIncome / filteredIncome.length)
      : 0;

  const deleteIncome = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/income/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      refreshData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          t("deleteFailed")
      );
    }
  };

  const editIncome = (item) => {
    setEditingIncome(item);
    setShowIncomeModal(true);
  };

  return (
    <>
      {showIncomeModal && (
        <AddIncomeModal
          open={showIncomeModal}
          setOpen={setShowIncomeModal}
          incomeToEdit={editingIncome}
          onSuccess={() => {
            refreshData();
            setEditingIncome(null);
            setShowIncomeModal(false);
          }}
        />
      )}

      <AppLayout>
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              💰 {t("incomeTracker")}
            </h1>

            <p className="mt-2 text-slate-500">
              {t("manageIncome")}
            </p>
          </div>

          <button
            onClick={() => {
              setEditingIncome(null);
              setShowIncomeModal(true);
            }}
            className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600"
          >
            + {t("addIncome")}
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">
              {t("totalIncome")}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-emerald-600">
              ₹{totalIncome.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">
              {t("todaysIncome")}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-blue-600">
              ₹{todayIncome.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">
              {t("thisMonth")}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-purple-600">
              ₹{thisMonthIncome.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">
              {t("averageIncome")}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-orange-500">
              ₹{averageIncome.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
          <input
            type="text"
            placeholder={`🔍 ${t("searchIncome")}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
          />

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none"
          >
            <option value="">
              {t("allCategories")}
            </option>

            <option value="Salary">{t("salary")}</option>
            <option value="Business">{t("business")}</option>
            <option value="Freelance">{t("freelance")}</option>
            <option value="Investment">{t("investment")}</option>
            <option value="Gift">{t("gift")}</option>
            <option value="Bonus">{t("bonus")}</option>
            <option value="Others">{t("others")}</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none"
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
            <option value="Amount High-Low">
              Amount: High to Low
            </option>
            <option value="Amount Low-High">
              Amount: Low to High
            </option>
          </select>
        </div>

        <IncomeTable
          income={filteredIncome}
          onEdit={editIncome}
          onDelete={deleteIncome}
        />
      </AppLayout>
    </>
  );
}

export default Income;