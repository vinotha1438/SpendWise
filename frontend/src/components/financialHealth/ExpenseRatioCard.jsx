function ExpenseRatioCard({
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

  const ratio =
    totalIncome > 0
      ? ((totalExpense / totalIncome) * 100).toFixed(1)
      : 0;

  let status = "";
  let color = "";

  if (ratio <= 50) {
    status = "Excellent";
    color = "text-green-600";
  } else if (ratio <= 70) {
    status = "Good";
    color = "text-emerald-500";
  } else if (ratio <= 90) {
    status = "Warning";
    color = "text-yellow-500";
  } else {
    status = "Critical";
    color = "text-red-600";
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <h2 className="text-xl font-bold mb-6">
        📊 Expense Ratio
      </h2>

      <div className="flex justify-between mb-3">
        <span className="text-slate-500">
          Expense / Income
        </span>

        <span className={`font-bold ${color}`}>
          {ratio}%
        </span>
      </div>

      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

        <div
          className={`h-full rounded-full ${
            ratio <= 50
              ? "bg-green-500"
              : ratio <= 70
              ? "bg-emerald-500"
              : ratio <= 90
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{
            width: `${Math.min(Number(ratio), 100)}%`,
          }}
        />

      </div>

      <div className="mt-5 text-center">

        <h3 className={`text-xl font-bold ${color}`}>
          {status}
        </h3>

        <p className="text-slate-500 mt-2">
          {ratio <= 50 &&
            "Excellent financial management."}

          {ratio > 50 &&
            ratio <= 70 &&
            "Healthy spending habits."}

          {ratio > 70 &&
            ratio <= 90 &&
            "Reduce expenses if possible."}

          {ratio > 90 &&
            "Your expenses are very high compared to your income."}
        </p>

      </div>

    </div>
  );
}

export default ExpenseRatioCard;