import { ok } from "node:assert";

function Recommendations({
  expenses = [],
  income = [],
}) {
  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const savings = totalIncome - totalExpense;

  const savingsRate =
    totalIncome > 0
      ? (savings / totalIncome) * 100
      : 0;

  const categoryTotals = {};

  expenses.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) +
      Number(item.amount);
  });

  const sortedCategories = Object.entries(
    categoryTotals
  ).sort((a, b) => b[1] - a[1]);

  const topCategory =
    sortedCategories.length > 0
      ? sortedCategories[0][0]
      : "N/A";

  const recommendations = [];

  if (savingsRate >= 30) {
    recommendations.push({
      type: "success",
      text: "Excellent! You are saving more than 30% of your income.",
    });
  } else if (savingsRate >= 20) {
    recommendations.push({
      type: "good",
      text: "Good savings habit. Try to increase your savings to 30%.",
    });
  } else {
    recommendations.push({
      type: "warning",
      text: "Your savings rate is low. Reduce unnecessary expenses.",
    });
  }

  if (totalExpense > totalIncome) {
    recommendations.push({
      type: "danger",
      text: "Your expenses are higher than your income. Review your spending immediately.",
    });
  }

  if (topCategory !== "N/A") {
    recommendations.push({
      type: "info",
      text: `Highest spending category: ${topCategory}. Consider reducing expenses in this category.`,
    });
  }

  if (expenses.length < 10) {
    recommendations.push({
      type: "info",
      text: "Add more transactions for better financial insights.",
    });
  }

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500 text-green-700";

      case "good":
        return "bg-emerald-100 border-emerald-500 text-emerald-700";

      case "warning":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";

      case "danger":
        return "bg-red-100 border-red-500 text-red-700";

      default:
        return "bg-blue-100 border-blue-500 text-blue-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <h2 className="text-2xl font-bold mb-6">
        💡 Smart Recommendations
      </h2>

      <div className="space-y-4">

        {recommendations.map((item, index) => (
          <div
            key={index}
            className={`border-l-4 rounded-xl p-4 ${getColor(
              item.type
            )}`}
          >
            {item.text}
          </div>
        ))}

      </div>

    </div>
  );
}

export default Recommendations;