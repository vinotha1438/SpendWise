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

function IncomeExpenseChart({
  income = [],
  expenses = [],
}) {
  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  if (income.length === 0 && expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-800">
          📊 Income vs Expense
        </h2>

        <div className="flex h-[350px] items-center justify-center text-slate-500">
          No financial data available.
        </div>
      </div>
    );
  }

  const data = [
    {
      name: "Overview",
      Income: totalIncome,
      Expense: totalExpense,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold text-slate-800">
        📊 Income vs Expense
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 13 }}
          />

          <YAxis
            tickFormatter={(value) =>
              `₹${value.toLocaleString("en-IN")}`
            }
          />

          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString("en-IN")}`,
              "",
            ]}
          />

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