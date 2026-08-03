import StatCard from "./StatCard";

function DashboardCards({
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

  const savings = balance > 0 ? balance : 0;

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

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
          subtitle="Available Balance"
        />

        <StatCard
          title="Total Savings"
          amount={savings}
          icon="🎯"
          color="#F59E0B"
          subtitle="Saved Amount"
        />

      </div>
    </section>
  );
}

export default DashboardCards;