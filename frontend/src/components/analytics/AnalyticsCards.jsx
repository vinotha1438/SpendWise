import StatCard from "../dashboard/StatCard";

function AnalyticsCards({
  expenses = [],
  income = [],
}) {
  const today = new Date();

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const previousMonth =
    currentMonth === 0 ? 11 : currentMonth - 1;

  const previousYear =
    currentMonth === 0
      ? currentYear - 1
      : currentYear;

  const currentIncome = income
    .filter((item) => {
      const date = new Date(item.income_date);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const previousIncome = income
    .filter((item) => {
      const date = new Date(item.income_date);

      return (
        date.getMonth() === previousMonth &&
        date.getFullYear() === previousYear
      );
    })
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const currentExpense = expenses
    .filter((item) => {
      const date = new Date(item.expense_date);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const previousExpense = expenses
    .filter((item) => {
      const date = new Date(item.expense_date);

      return (
        date.getMonth() === previousMonth &&
        date.getFullYear() === previousYear
      );
    })
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const balance = totalIncome - totalExpense;

  const savingsRate =
    totalIncome > 0
      ? ((balance / totalIncome) * 100).toFixed(1)
      : 0;

  const getChange = (current, previous) => {
    if (previous === 0) {
      return {
        text: "No previous data",
        type: "neutral",
      };
    }

    const percent = (
      ((current - previous) / previous) *
      100
    ).toFixed(1);

    return {
      text: `${
        percent >= 0 ? "▲" : "▼"
      } ${Math.abs(percent)}% vs Last Month`,
      type:
        percent >= 0
          ? "positive"
          : "negative",
    };
  };

  const incomeChange = getChange(
    currentIncome,
    previousIncome
  );

  const expenseChange = getChange(
    currentExpense,
    previousExpense
  );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Total Income"
        amount={totalIncome}
        icon="💰"
        color="#22C55E"
        subtitle="Money Received"
        change={incomeChange.text}
        changeType={incomeChange.type}
      />

      <StatCard
        title="Total Expense"
        amount={totalExpense}
        icon="💸"
        color="#EF4444"
        subtitle="Money Spent"
        change={expenseChange.text}
        changeType={expenseChange.type}
      />

      <StatCard
        title="Current Balance"
        amount={balance}
        icon="🏦"
        color="#3B82F6"
        subtitle="Available Balance"
      />

      <StatCard
        title="Savings Rate"
        amount={`${savingsRate}%`}
        icon="📈"
        color="#F59E0B"
        subtitle="Income Saved"
      />

    </div>
  );
}

export default AnalyticsCards;