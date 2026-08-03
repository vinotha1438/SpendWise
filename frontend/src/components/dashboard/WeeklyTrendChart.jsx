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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">

      <h2 className="mb-5 text-xl font-bold text-slate-800">
        📈 Weekly Spending Trend
      </h2>

      <div className="h-72 w-full">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
            />

            <YAxis tick={{ fontSize: 12 }} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#10B981"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default WeeklyTrendChart;