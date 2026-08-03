import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";
import API from "../services/api";

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
    refreshData,
  } = useData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [editingExpense, setEditingExpense] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [recurringExpenses, setRecurringExpenses] =
    useState([]);

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
      alert(error.response?.data?.message || "Delete Failed");
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
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const editExpense = (expense) => {
    console.log("Editing Expense:", expense);
    console.log(expense);

    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const editIncome = (item) => {
    console.log("Editing Income:", item);

    setEditingIncome(item);
    setShowIncomeForm(true);
  };

  const today = new Date();

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.expense_date);

    const matchesSearch = expense.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      expense.category === selectedCategory;

    let matchesDate = true;

    switch (dateFilter) {
      case "Today":
        matchesDate =
          expenseDate.toDateString() === today.toDateString();
        break;

      case "This Week": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        matchesDate =
          expenseDate >= startOfWeek &&
          expenseDate <= endOfWeek;
        break;
      }

      case "This Month":
        matchesDate =
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getFullYear() === today.getFullYear();
        break;

      case "This Year":
        matchesDate =
          expenseDate.getFullYear() === today.getFullYear();
        break;

      default:
        matchesDate = true;
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDate
    );
  });

  return (
    <>
      {showExpenseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <ExpenseForm
              expense={editingExpense}
              isEdit={true}
              onSuccess={() => {
                setShowExpenseForm(false);
                setEditingExpense(null);
                refreshData();
              }}
            />

            <button
              onClick={() => {
                setShowExpenseForm(false);
                setEditingExpense(null);
              }}
              className="mt-4 w-full rounded-xl bg-slate-200 py-3 font-medium hover:bg-slate-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showIncomeForm && (
        <AddIncomeModal
          open={showIncomeForm}
          setOpen={setShowIncomeForm}
          incomeToEdit={editingIncome}
          onSuccess={() => {
            refreshData();
            setEditingIncome(null);
            setShowIncomeForm(false);
          }}
        />
      )}

      <AppLayout
        expenses={expenses}
        income={income}
      >

        <DashboardHeader />

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-60 rounded-xl border border-slate-300 bg-white px-4 py-2 shadow-sm focus:border-emerald-500 focus:outline-none"
          >
            <option>All</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>

        <DashboardCards
          expenses={expenses}
          income={income}
        />

        <DailyAnalytics expenses={expenses} />

        <SpendingInsights expenses={expenses} />

        <WeeklyTrendChart expenses={expenses} />

        <BudgetProgress expenses={expenses} />

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

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart expenses={expenses} />
          <ExpensePieChart expenses={expenses} />
        </div>
      </AppLayout>
    </>
  );
}

export default Dashboard;