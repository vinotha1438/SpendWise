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
import DailyAnalytics from "@/components/dashboard/DailyAnalytics";
import WeeklyTrendChart from "@/components/dashboard/WeeklyTrendChart";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import ExportPDF from "../components/reports/ExportPDF";
import ExportExcel from "../components/reports/ExportExcel";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [editingExpense, setEditingExpense] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  console.log("Dashboard Render:", showExpenseForm);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/income", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncome(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchIncome();
  }, []);

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExpenses();
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

      fetchIncome();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const editExpense = (expense) => {
    alert("Inside editExpense");
    console.log(expense);

    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const editIncome = (item) => {
    alert("Income Edit - Next Step");
    console.log(item);
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "500px",
            }}
          >
            <ExpenseForm
              expense={editingExpense}
              isEdit={true}
              onSuccess={() => {
                setShowExpenseForm(false);
                setEditingExpense(null);
                fetchExpenses();
              }}
            />

            <button
              onClick={() => {
                setShowExpenseForm(false);
                setEditingExpense(null);
              }}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <AppLayout>
        <DashboardHeader />

        <div style={{ marginBottom: "20px" }}>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
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

        <ExpenseChart expenses={expenses} />

        <ExpensePieChart expenses={expenses} />
      </AppLayout>
    </>
  );
}

export default Dashboard;