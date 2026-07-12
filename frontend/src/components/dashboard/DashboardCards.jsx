import StatCard from "./StatCard";

function DashboardCards({ expenses, income }) {
  const totalExpense = expenses.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const totalIncome = income.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const balance = totalIncome - totalExpense;

  const savings =
    totalIncome > 0
      ? ((balance / totalIncome) * 100).toFixed(1)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

      <StatCard
        title="Total Income"
        amount={totalIncome}
        color="#22C55E"
      />

      <StatCard
        title="Total Expense"
        amount={totalExpense}
        color="#EF4444"
      />

      <StatCard
        title="Balance"
        amount={balance}
        color="#3B82F6"
      />

      <StatCard
        title="Savings %"
        amount={savings}
        color="#F59E0B"
        isCurrency={false}
      />

    </div>
  );
}

export default DashboardCards;