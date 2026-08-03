import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#22C55E",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#EC4899",
];

function CategoryPieChart({ expenses = [] }) {
  const categoryData = {};

  expenses.forEach((item) => {
    const category = item.category || "Others";

    categoryData[category] =
      (categoryData[category] || 0) +
      Number(item.amount || 0);
  });

  const data = Object.entries(categoryData).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const totalExpense = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold text-slate-800">
        🥧 Expense by Category
      </h2>

      {data.length === 0 ? (
        <div className="flex h-[350px] items-center justify-center text-slate-500">
          No expense data available.
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label={({ percent }) =>
                `${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString(
                  "en-IN"
                )}`,
                "Amount",
              ]}
            />

            <Legend verticalAlign="bottom" />

          </PieChart>
        </ResponsiveContainer>
      )}

      {data.length > 0 && (
        <p className="mt-4 text-center text-sm text-slate-500">
          Total Expense:{" "}
          <span className="font-semibold text-slate-700">
            ₹{totalExpense.toLocaleString("en-IN")}
          </span>
        </p>
      )}

    </div>
  );
}

export default CategoryPieChart;