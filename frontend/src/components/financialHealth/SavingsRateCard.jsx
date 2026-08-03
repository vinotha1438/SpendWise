function SavingsRateCard({
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
      ? ((savings / totalIncome) * 100).toFixed(1)
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <h2 className="text-xl font-bold mb-5">
        💰 Savings Rate
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-slate-500">
            Total Income
          </span>

          <span className="font-bold text-green-600">
            ₹{totalIncome.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Total Expense
          </span>

          <span className="font-bold text-red-600">
            ₹{totalExpense.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Savings
          </span>

          <span
            className={`font-bold ${
              savings >= 0
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            ₹{savings.toLocaleString("en-IN")}
          </span>
        </div>

      </div>

      <div className="mt-6">

        <div className="flex justify-between mb-2">

          <span className="text-slate-600">
            Savings Rate
          </span>

          <span className="font-bold">
            {savingsRate}%
          </span>

        </div>

        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{
              width: `${Math.min(
                Number(savingsRate),
                100
              )}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default SavingsRateCard;