import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
];

function ExpensePieChart({ expenses = [] }) {
  const categoryMap = {};

  expenses.forEach((expense) => {
    const category = expense.category || "Others";

    categoryMap[category] =
      (categoryMap[category] || 0) +
      Number(expense.amount || 0);
  });

  const data = Object.keys(categoryMap).map((category) => ({
    name: category,
    value: categoryMap[category],
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
      <h2 className="mb-5 text-xl font-bold text-slate-800">
        🥧 Expense by Category
      </h2>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((item, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              height={36}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpensePieChart;