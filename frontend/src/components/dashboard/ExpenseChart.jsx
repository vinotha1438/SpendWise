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
      Amount: Number(item.amount || 0),
    }));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-800">
          📊 Expense Analytics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Last 7 recorded expenses.
        </p>

      </div>

      {chartData.length === 0 ? (
        <div className="flex h-80 items-center justify-center text-slate-500">
          No expense data available.
        </div>
      ) : (
        <div className="h-72 w-full sm:h-80">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 12,
                }}
              />

              <YAxis
                tickFormatter={(value) =>
                  `₹${value}`
                }
                tick={{
                  fontSize: 12,
                }}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString(
                    "en-IN"
                  )}`,
                  "Amount",
                ]}
              />

              <Bar
                dataKey="Amount"
                fill="#10B981"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>
      )}

    </div>
  );
}

export default ExpenseChart;