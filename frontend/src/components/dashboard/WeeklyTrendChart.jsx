import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function WeeklyTrendChart({ expenses }) {
  const today = new Date();

  const data = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(today.getDate() - i);

    const total = expenses
      .filter(
        (item) =>
          new Date(item.date).toDateString() ===
          day.toDateString()
      )
      .reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

    data.push({
      day: day.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      amount: total,
    });
  }

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        marginBottom: "25px",
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
          color: "#0F172A",
        }}
      >
        📈 Weekly Spending Trend
      </h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#14B8A6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyTrendChart;