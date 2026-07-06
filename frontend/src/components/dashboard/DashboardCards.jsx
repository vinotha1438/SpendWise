import StatCard from "./StatCard";

function DashboardCards({ expenses }) {
  const totalExpense = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const totalTransactions = expenses.length;

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => Number(expense.amount)))
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatCard
        title="Total Expense"
        amount={totalExpense}
        color="#EF4444"
      />

      <StatCard
        title="Transactions"
        amount={totalTransactions}
        color="#14B8A6"
        isCurrency={false}
      />

      <StatCard
        title="Highest Expense"
        amount={highestExpense}
        color="#F59E0B"
      />

      <StatCard
        title="This Month"
        amount={totalExpense}
        color="#3B82F6"
      />
    </div>
  );
}

export default DashboardCards;