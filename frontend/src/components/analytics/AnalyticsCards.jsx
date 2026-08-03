import StatCard from "../dashboard/StatCard";

function AnalyticsCards({
  expenses = [],
  income = [],
}) {
  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const balance = totalIncome - totalExpense;

  const savingsRate =
    totalIncome > 0
      ? Math.max(
          0,
          ((balance / totalIncome) * 100).toFixed(1)
        )
      : 0;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Total Income"
        amount={totalIncome}
        icon="💰"
        color="#22C55E"
        subtitle="Money Received"
      />

      <StatCard
        title="Total Expense"
        amount={totalExpense}
        icon="💸"
        color="#EF4444"
        subtitle="Money Spent"
      />

      <StatCard
        title="Current Balance"
        amount={balance}
        icon="🏦"
        color="#3B82F6"
        subtitle={
          balance >= 0
            ? "Available Balance"
            : "Overspent"
        }
      />

      <StatCard
        title="Savings Rate"
        amount={`${savingsRate}%`}
        icon="📈"
        color="#F59E0B"
        subtitle={
          savingsRate > 0
            ? "Income Saved"
            : "No Savings Yet"
        }
      />

    </div>
  );
}

export default AnalyticsCards;