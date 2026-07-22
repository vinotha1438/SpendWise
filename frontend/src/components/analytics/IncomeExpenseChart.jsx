import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

function IncomeExpenseChart({ income = [], expenses = [] }) {
  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const data = [
    {
      name: "Finance",
      Income: totalIncome,
      Expense: totalExpense,
    },
  ];

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
        📊 Income vs Expense
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

          <XAxis dataKey="name" stroke="#CBD5E1" />

          <YAxis stroke="#CBD5E1" />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="Income"
            fill="#22C55E"
            radius={[8, 8, 0, 0]}
          />

          <Bar
            dataKey="Expense"
            fill="#EF4444"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncomeExpenseChart;