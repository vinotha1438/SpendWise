function SmartInsights({ expenses = [] }) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-800">
          💡 Smart Insights
        </h2>

        <div className="flex h-40 items-center justify-center text-slate-500">
          No expense data available.
        </div>
      </div>
    );
  }

  const amounts = expenses.map((item) =>
    Number(item.amount || 0)
  );

  const totalExpense = amounts.reduce(
    (sum, value) => sum + value,
    0
  );

  const averageExpense =
    totalExpense / expenses.length;

  const highestExpense = expenses.reduce(
    (max, item) =>
      Number(item.amount || 0) >
      Number(max.amount || 0)
        ? item
        : max
  );

  const lowestExpense = expenses.reduce(
    (min, item) =>
      Number(item.amount || 0) <
      Number(min.amount || 0)
        ? item
        : min
  );

  const categoryTotals = {};

  expenses.forEach((item) => {
    const category = item.category || "Others";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(item.amount || 0);
  });

  const topCategory = Object.entries(
    categoryTotals
  ).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    {
      title: "🏆 Highest Expense",
      subtitle:
        highestExpense.title || "No Title",
      value: `₹${Number(
        highestExpense.amount
      ).toLocaleString("en-IN")}`,
    },
    {
      title: "💵 Lowest Expense",
      subtitle:
        lowestExpense.title || "No Title",
      value: `₹${Number(
        lowestExpense.amount
      ).toLocaleString("en-IN")}`,
    },
    {
      title: "📊 Average Expense",
      subtitle: "Per Transaction",
      value: `₹${averageExpense.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 0,
        }
      )}`,
    },
    {
      title: "🥇 Top Category",
      subtitle: topCategory?.[0] || "Others",
      value: `₹${Number(
        topCategory?.[1] || 0
      ).toLocaleString("en-IN")}`,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold text-slate-800">
        💡 Smart Insights
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-slate-800">
              {card.title}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {card.subtitle}
            </p>

            <h2 className="mt-4 text-2xl font-bold text-emerald-600">
              {card.value}
            </h2>
          </div>
        ))}

      </div>

    </div>
  );
}

export default SmartInsights;