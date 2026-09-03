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

  const totalExpense = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-800">
          🥧 Expense by Category
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Category-wise expense distribution.
        </p>

      </div>

      {data.length === 0 ? (

        <div className="flex h-72 items-center justify-center text-slate-500 sm:h-80">
          No expense data available.
        </div>

      ) : (

        <>
          <div className="h-72 w-full sm:h-80">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.name}
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

                <Legend
                  verticalAlign="bottom"
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            Total Expense{" "}
            <span className="font-semibold text-slate-700">
              ₹{totalExpense.toLocaleString("en-IN")}
            </span>
          </p>
        </>

      )}

    </div>
  );
}

export default ExpensePieChart;