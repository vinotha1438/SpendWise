import { useEffect, useState } from "react";
import API from "../services/api";

import AppLayout from "../components/layout/AppLayout";
import ExportPDF from "../components/reports/ExportPDF";
import ExportExcel from "../components/reports/ExportExcel";

function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);

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
      console.log(error);
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

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const netBalance = totalIncome - totalExpense;

  const totalTransactions =
    expenses.length + income.length;

  return (
    <AppLayout>
      <div style={{ padding: "10px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          📊 Reports
        </h1>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <ExportPDF expenses={expenses} />
          <ExportExcel expenses={expenses} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div style={cardStyle}>
            <h3>💸 Total Expense</h3>
            <h2>₹{totalExpense.toLocaleString()}</h2>
          </div>

          <div style={cardStyle}>
            <h3>💰 Total Income</h3>
            <h2>₹{totalIncome.toLocaleString()}</h2>
          </div>

          <div style={cardStyle}>
            <h3>💎 Net Balance</h3>
            <h2>₹{netBalance.toLocaleString()}</h2>
          </div>

          <div style={cardStyle}>
            <h3>📋 Transactions</h3>
            <h2>{totalTransactions}</h2>
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#111827",
            color: "white",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Payment</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.title}</td>
                <td style={tdStyle}>{item.category}</td>
                <td style={tdStyle}>
                  ₹{Number(item.amount).toLocaleString()}
                </td>
                <td style={tdStyle}>{item.payment_method}</td>
                <td style={tdStyle}>
                  {item.expense_date
                    ? new Date(item.expense_date).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

const cardStyle = {
  background: "#111827",
  color: "white",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  border: "1px solid #374151",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  background: "#1F2937",
  color: "#CBD5E1",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #374151",
};

export default Reports;