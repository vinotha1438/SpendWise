function HealthGauge({
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

  const circumference = 2 * Math.PI * 70;
  const offset =
    circumference - (score / 100) * circumference;

  let color = "#22C55E";

  if (score < 40) {
    color = "#EF4444";
  } else if (score < 70) {
    color = "#F59E0B";
  } else if (score < 90) {
    color = "#3B82F6";
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">

      <h2 className="text-2xl font-bold text-center mb-8">
        📈 Health Gauge
      </h2>

      <div className="flex justify-center">

        <div className="relative w-52 h-52">

          <svg
            className="w-52 h-52 -rotate-90"
            viewBox="0 0 180 180"
          >
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="14"
            />

            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke={color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-5xl font-bold">
              {score}
            </span>

            <span className="text-slate-500">
              /100
            </span>

          </div>

        </div>

      </div>

      <p className="text-center text-slate-500 mt-6">
        Your overall financial health based on
        income, expenses and savings.
      </p>

    </div>
  );
}

export default HealthGauge;