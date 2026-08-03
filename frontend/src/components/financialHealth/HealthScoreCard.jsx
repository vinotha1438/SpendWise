function HealthScoreCard({
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

  let score = 0;

  if (totalIncome > 0) {
    const savingsRate =
      ((totalIncome - totalExpense) / totalIncome) * 100;

    if (savingsRate >= 50) {
      score = 100;
    } else if (savingsRate >= 40) {
      score = 90;
    } else if (savingsRate >= 30) {
      score = 80;
    } else if (savingsRate >= 20) {
      score = 70;
    } else if (savingsRate >= 10) {
      score = 60;
    } else if (savingsRate >= 0) {
      score = 50;
    } else {
      score = 30;
    }
  }

  let status = "Poor";
  let color = "text-red-500";

  if (score >= 90) {
    status = "Excellent";
    color = "text-green-600";
  } else if (score >= 75) {
    status = "Very Good";
    color = "text-emerald-500";
  } else if (score >= 60) {
    status = "Good";
    color = "text-blue-500";
  } else if (score >= 40) {
    status = "Average";
    color = "text-yellow-500";
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">

      <h2 className="text-2xl font-bold mb-6">
        ❤️ Financial Health Score
      </h2>

      <div className="flex flex-col items-center">

        <div className="text-6xl font-bold text-emerald-600">
          {score}
        </div>

        <p className="text-slate-500 mt-2">
          out of 100
        </p>

        <div
          className={`mt-4 text-2xl font-semibold ${color}`}
        >
          {status}
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">

        <div className="rounded-xl bg-slate-100 p-4 text-center">
          <p className="text-slate-500">
            Income
          </p>

          <h3 className="text-xl font-bold text-green-600">
            ₹{totalIncome.toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-100 p-4 text-center">
          <p className="text-slate-500">
            Expense
          </p>

          <h3 className="text-xl font-bold text-red-600">
            ₹{totalExpense.toLocaleString("en-IN")}
          </h3>
        </div>

      </div>

    </div>
  );
}

export default HealthScoreCard;