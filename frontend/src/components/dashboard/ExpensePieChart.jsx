import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#14B8A6",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#10B981",
  "#EC4899",
];

function ExpensePieChart({ expenses }) {
  const categoryMap = {};

  expenses.forEach((expense) => {
    const category = expense.category || "Others";

    categoryMap[category] =
      (categoryMap[category] || 0) + Number(expense.amount);
  });

  const data = Object.keys(categoryMap).map((category) => ({
    name: category,
    value: categoryMap[category],
  }));

  return (
    <div
      style={{
        background: "#111827",
        marginTop: "30px",
        padding: "20px",
        borderRadius: "15px",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        Expense By Category
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpensePieChart;