import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function IncomeExpenseChart({
  expenses = [],
  income = [],
}) {
  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const data = [
    {
      name: "Income",
      amount: totalIncome,
    },
    {
      name: "Expense",
      amount: totalExpense,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          📊 Income vs Expense
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Compare your total income and expenses.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            <Legend />

            <Bar
              dataKey="amount"
              name="Amount"
              fill="#10B981"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-sm text-slate-500">
            Total Income
          </p>

          <p className="mt-1 text-xl font-bold text-emerald-600">
            ₹{totalIncome.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-4">
          <p className="text-sm text-slate-500">
            Total Expense
          </p>

          <p className="mt-1 text-xl font-bold text-red-600">
            ₹{totalExpense.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default IncomeExpenseChart;