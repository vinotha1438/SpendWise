import { useEffect, useState } from "react";
import API from "../services/api";

import AppLayout from "../components/layout/AppLayout";
import DashboardCards from "../components/dashboard/DashboardCards";
import TransactionTable from "../components/transaction/TransactionTable";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import ExpensePieChart from "../components/dashboard/ExpensePieChart";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
      fetchIncome();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const editExpense = (expense) => {
    alert(
      `Edit Feature Coming Next\n\nExpense: ${expense.title}`
    );
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "white",
            }}
          >
            Dashboard
          </h1>

          <p
            style={{
              color: "#94A3B8",
              marginTop: "8px",
            }}
          >
            Track your expenses and manage your finances.
          </p>
        </div>
      </div>

      <DashboardCards
        expenses={expenses}
        income={income}
      />

      <div
        style={{
          marginTop: "30px",
          background: "#111827",
          padding: "20px",
          borderRadius: "15px",
          border: "1px solid #1F2937",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search Expense..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #374151",
              background: "#1F2937",
              color: "white",
            }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #374151",
              background: "#1F2937",
              color: "white",
            }}
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Office">Office</option>
            <option value="Home">Home</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <TransactionTable
          expenses={filteredExpenses}
          onDelete={deleteExpense}
          onEdit={editExpense}
        />
      </div>

      <ExpenseChart expenses={expenses} />

      <ExpensePieChart expenses={expenses} />
    </AppLayout>
  );
}

export default Dashboard;