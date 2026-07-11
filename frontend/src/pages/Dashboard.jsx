import { useEffect, useState } from "react";
import API from "../services/api";

import AppLayout from "../components/layout/AppLayout";
import DashboardCards from "../components/dashboard/DashboardCards";
import TransactionTable from "../components/transaction/TransactionTable";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN =", token);

      const response = await API.get("/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response =", response.data);

      setExpenses(Array.isArray(response.data) ? response.data : []);

    } catch (error) {
      console.log("Fetch Error =", error);

      if (error.response) {
        console.log(error.response.data);
        alert(error.response.data.message);
      } else {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
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

      <h1>Welcome Back 👋</h1>

      <input
        type="text"
        placeholder="Search Expense"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All</option>
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

      <DashboardCards expenses={expenses} />

      <TransactionTable
        expenses={filteredExpenses}
        onDelete={deleteExpense}
      />

    </AppLayout>
  );
}

export default Dashboard;