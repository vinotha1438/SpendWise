import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MonthlyTrendChart({ expenses = [] }) {
  const monthlyTotals = {};

  expenses.forEach((item) => {
    if (!item.expense_date) return;

    const date = new Date(item.expense_date);

    if (Number.isNaN(date.getTime())) return;

    const year = date.getFullYear();
    const month = date.getMonth();

    const key = `${year}-${String(month + 1).padStart(2, "0")}`;

    if (!monthlyTotals[key]) {
      monthlyTotals[key] = {
        year,
        month,
        amount: 0,
      };
    }

    monthlyTotals[key].amount += Number(
      item.amount || 0
    );
  });

  const data = Object.entries(monthlyTotals)
    .sort(([keyA], [keyB]) =>
      keyA.localeCompare(keyB)
    )
    .map(([key, item]) => {
      const date = new Date(
        item.year,
        item.month,
        1
      );

      return {
        month: date.toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
        amount: item.amount,
      };
    });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          📈 Monthly Expense Trend
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Track how your expenses change month by month.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center text-slate-500">
          No expense data available.
        </div>
      ) : (
        <div className="h-[320px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickFormatter={(value) =>
                  `₹${Number(value).toLocaleString(
                    "en-IN"
                  )}`
                }
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString(
                    "en-IN"
                  )}`
                }
              />

              <Line
                type="monotone"
                dataKey="amount"
                name="Expense"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default MonthlyTrendChart;