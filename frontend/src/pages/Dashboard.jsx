import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";
import API from "../services/api";
import { matchesDateFilter, sortTransactions } from "../utils/dateFilter";

import AppLayout from "../components/layout/AppLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardCards from "../components/dashboard/DashboardCards";
import ExpenseSection from "../components/dashboard/ExpenseSection";
import IncomeSection from "../components/dashboard/IncomeSection";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import ExpensePieChart from "../components/dashboard/ExpensePieChart";
import ExpenseForm from "../components/transaction/ExpenseForm";
import SpendingInsights from "../components/dashboard/SpendingInsights";
import DailyAnalytics from "../components/dashboard/DailyAnalytics";
import WeeklyTrendChart from "../components/dashboard/WeeklyTrendChart";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import AddIncomeModal from "../components/transaction/AddIncomeModal";
import UpcomingPayments from "../components/recurring/UpcomingPayments";

function Dashboard() {
  const {
    expenses,
    income,
    totalBalance,
    refreshData,
  } = useData();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  const [editingExpense, setEditingExpense] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [dateFilter, setDateFilter] = useState("All");

  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const [recurringExpenses, setRecurringExpenses] = useState([]);

  const fetchRecurringExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        "/recurring-expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecurringExpenses(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refreshData();
    fetchRecurringExpenses();
  }, []);

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      refreshData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

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
          "Delete Failed"
      );
    }
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const editIncome = (item) => {
    setEditingIncome(item);
    setShowIncomeForm(true);
  };

  const openAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const openAddIncome = () => {
    setEditingIncome(null);
    setShowIncomeForm(true);
  };

  const closeExpenseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const closeIncomeForm = () => {
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

  const today = new Date();

  const filteredExpenses = sortTransactions(
    expenses.filter((expense) => {
      const matchesSearch =
        expense.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        expense.where_to_pay
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "" ||
        expense.category === selectedCategory;

      const matchesDate = matchesDateFilter(
        expense.expense_date,
        dateFilter
      );

      return matchesSearch && matchesCategory && matchesDate;
    }),
    sortBy,
    "expense_date"
  );

  return (
    <>
      {/* Expense Form */}
      {showExpenseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <ExpenseForm
              expense={editingExpense}
              isEdit={!!editingExpense}
              onSuccess={() => {
                closeExpenseForm();
                refreshData();
              }}
            />

            <button
              onClick={closeExpenseForm}
              className="mt-4 w-full rounded-xl bg-slate-200 py-3 font-medium transition hover:bg-slate-300"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* Income Form */}
      {showIncomeForm && (
        <AddIncomeModal
          open={showIncomeForm}
          setOpen={setShowIncomeForm}
          incomeToEdit={editingIncome}
          onSuccess={() => {
            refreshData();
            closeIncomeForm();
          }}
        />
      )}

      <AppLayout
        expenses={expenses}
        income={income}
      >

        <DashboardHeader />

        {/* Add Buttons */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              onClick={openAddExpense}
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              🧾 Add Expense
            </button>

            <button
              onClick={openAddIncome}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              💰 Add Income
            </button>

          </div>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-emerald-500 focus:outline-none sm:w-60"
          >
            <option value="All">All</option>
            <option value="Today">Today</option>
            <option value="This Week">
              This Week
            </option>
            <option value="This Month">
              This Month
            </option>
            <option value="This Year">
              This Year
            </option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-emerald-500 focus:outline-none sm:w-60"
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

        <DashboardCards
          expenses={expenses}
          income={income}
          totalBalance={totalBalance}
        />

        <DailyAnalytics
          expenses={expenses}
        />

        <SpendingInsights
          expenses={expenses}
        />

        <WeeklyTrendChart
          expenses={expenses}
        />

        <BudgetProgress
          expenses={expenses}
        />

        <UpcomingPayments
          recurringExpenses={recurringExpenses}
        />

        <ExpenseSection
          expenses={filteredExpenses}
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onDelete={deleteExpense}
          onEdit={editExpense}
        />

        <IncomeSection
          income={income}
          onDelete={deleteIncome}
          onEdit={editIncome}
        />

        <div className="mt-8 grid w-full grid-cols-1 gap-6 xl:grid-cols-2">

          <ExpenseChart
            expenses={expenses}
          />

          <ExpensePieChart
            expenses={expenses}
          />

        </div>

      </AppLayout>
    </>
  );
}

export default Dashboard;