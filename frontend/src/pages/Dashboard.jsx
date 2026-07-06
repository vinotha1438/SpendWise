import { useEffect, useState } from "react";
import API from "../services/api";

import AppLayout from "../components/layout/AppLayout";
import DashboardCards from "../components/dashboard/DashboardCards";
import TransactionTable from "../components/transaction/TransactionTable";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <AppLayout>
      <h1 style={{ marginBottom: "25px" }}>
        Welcome Back 👋
      </h1>

      <DashboardCards expenses={expenses} />
      <TransactionTable expenses={expenses} />

    </AppLayout>
  );
}

export default Dashboard;