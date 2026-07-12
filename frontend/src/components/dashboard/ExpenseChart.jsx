import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ExpenseChart({ expenses }) {
  const chartData = expenses.map((item) => ({
    name: item.title,
    Amount: Number(item.amount),
  }));

  return (
    <div
      style={{
        background: "#111827",
        padding: "20px",
        borderRadius: "15px",
        marginTop: "30px",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        Expense Analytics
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid stroke="#374151" />

          <XAxis dataKey="name" stroke="#ffffff" />

          <YAxis stroke="#ffffff" />

          <Tooltip />

          <Bar
            dataKey="Amount"
            fill="#14B8A6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;