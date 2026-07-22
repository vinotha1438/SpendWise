import { useEffect, useState } from "react";
import API from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import IncomeExpenseChart from "../components/analytics/IncomeExpenseChart";
import CategoryPieChart from "../components/analytics/CategoryPieChart";
import MonthlyTrendChart from "../components/analytics/MonthlyTrendChart";
import SmartInsights from "../components/analytics/SmartInsights";

function Analytics() {
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

    const savings = totalIncome - totalExpense;

    const savingsRate =
        totalIncome === 0
            ? 0
            : ((savings / totalIncome) * 100).toFixed(1);

    return (
        <AppLayout>
            <h1
                style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    marginBottom: "30px",
                }}
            >
                📊 Analytics
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "20px",
                }}
            >
                <div style={cardStyle}>
                    <h3>💰 Total Income</h3>
                    <h2>₹{totalIncome.toLocaleString()}</h2>
                </div>

                <div style={cardStyle}>
                    <h3>💸 Total Expense</h3>
                    <h2>₹{totalExpense.toLocaleString()}</h2>
                </div>

                <div style={cardStyle}>
                    <h3>💎 Savings</h3>
                    <h2>₹{savings.toLocaleString()}</h2>
                </div>

                <div style={cardStyle}>
                    <h3>📈 Savings Rate</h3>
                    <h2>{savingsRate}%</h2>
                </div>
            </div>

            {/* Income vs Expense Chart */}
            <IncomeExpenseChart
                income={income}
                expenses={expenses}
            />

            <CategoryPieChart
                expenses={expenses}
            />

            <MonthlyTrendChart
                expenses={expenses}
            />

            <SmartInsights expenses={expenses} />

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

export default Analytics;