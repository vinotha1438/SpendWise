import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function MonthlyTrendChart({ expenses = [] }) {
  const monthlyData = {};

  expenses.forEach((item) => {
    if (!item.expense_date) return;

    const month = new Date(item.expense_date).toLocaleString("default", {
      month: "short",
    });

    monthlyData[month] =
      (monthlyData[month] || 0) + Number(item.amount);
  });

  const data = Object.keys(monthlyData).map((month) => ({
    month,
    amount: monthlyData[month],
  }));

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "16px",
        padding: "20px",
        marginTop: "25px",
        border: "1px solid #374151",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        📈 Monthly Expense Trend
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

          <XAxis dataKey="month" stroke="#CBD5E1" />

          <YAxis stroke="#CBD5E1" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3B82F6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyTrendChart;