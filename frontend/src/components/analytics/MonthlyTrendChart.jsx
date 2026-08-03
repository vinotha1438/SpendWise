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

    const date = new Date(item.expense_date);

    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: date.toLocaleString("default", {
          month: "short",
        }),
        amount: 0,
      };
    }

    monthlyData[monthKey].amount += Number(
      item.amount || 0
    );
  });

  const data = Object.keys(monthlyData)
    .sort()
    .map((key) => monthlyData[key]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold text-slate-800">
        📈 Monthly Expense Trend
      </h2>

      {data.length === 0 ? (
        <div className="flex h-[350px] items-center justify-center text-slate-500">
          No expense data available.
        </div>
      ) : (
        <>
          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <LineChart data={data}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 13 }}
              />

              <YAxis
                tickFormatter={(value) =>
                  `₹${value.toLocaleString("en-IN")}`
                }
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
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />

            </LineChart>
          </ResponsiveContainer>

          <p className="mt-4 text-center text-sm text-slate-500">
            Monthly spending trend based on recorded expenses.
          </p>
        </>
      )}

    </div>
  );
}

export default MonthlyTrendChart;