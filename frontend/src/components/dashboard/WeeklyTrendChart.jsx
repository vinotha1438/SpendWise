import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function WeeklyTrendChart({ expenses = [] }) {
  const today = new Date();

  const data = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(today.getDate() - i);

    const total = expenses
      .filter(
        (item) =>
          item.expense_date &&
          new Date(item.expense_date).toDateString() ===
            day.toDateString()
      )
      .reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

    data.push({
      day: day.toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      amount: total,
    });
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-800">
          📈 Weekly Spending Trend
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Expense trend for the last 7 days.
        </p>

      </div>

      {expenses.length === 0 ? (

        <div className="flex h-72 items-center justify-center text-slate-500">
          No expense data available.
        </div>

      ) : (

        <div className="h-72 w-full sm:h-80">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 15,
                left: 5,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{
                  fontSize: 12,
                }}
              />

              <YAxis
                tick={{
                  fontSize: 12,
                }}
                tickFormatter={(value) => `₹${value}`}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString(
                    "en-IN"
                  )}`,
                  "Expense",
                ]}
              />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>
  );
}

export default WeeklyTrendChart;