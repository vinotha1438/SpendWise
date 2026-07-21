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

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [editingExpense, setEditingExpense] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
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

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      expense.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout>
      <DashboardHeader />

      <DashboardCards
        expenses={expenses}
        income={income}
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

      {showExpenseForm && (
        <div
          style={{
            background: "red",
            color: "white",
            padding: "20px",
            margin: "20px",
            borderRadius: "10px",
          }}
        >
          FORM OPENED
        </div>
      )}
    </AppLayout>
  );
}

export default Dashboard;