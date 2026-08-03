import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ExpenseChart({ expenses = [] }) {
  const chartData = expenses
    .slice(-7)
    .map((item) => ({
      name:
        item.title.length > 10
          ? item.title.substring(0, 10) + "..."
          : item.title,
      Amount: Number(item.amount),
    }));

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
      <h2 className="mb-5 text-xl font-bold text-slate-800">
        📊 Expense Analytics
      </h2>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
            />

            <YAxis tick={{ fontSize: 12 }} />

            <Tooltip />

            <Bar
              dataKey="Amount"
              fill="#10B981"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenseChart;