import { useTranslation } from "react-i18next";
import StatCard from "./StatCard";

function DashboardCards({
  expenses = [],
  income = [],
  totalBalance = 0,
}) {
  const { t } = useTranslation();

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  // "Savings" here means net income vs expense for the period being
  // viewed — a distinct concept from Total Balance (which comes from
  // account current_balance, including opening balances, and is
  // passed in as totalBalance).
  const savings = totalIncome - totalExpense > 0
    ? totalIncome - totalExpense
    : 0;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-8">

      <StatCard
        title={t("totalExpense")}
        amount={totalExpense}
        icon="💸"
        color="#EF4444"
        subtitle={t("moneySpent")}
      />

      <StatCard
        title={t("currentBalance")}
        amount={totalBalance}
        icon="🏦"
        color="#3B82F6"
        subtitle={t("availableBalance")}
      />

      <StatCard
        title={t("totalSavings")}
        amount={savings}
        icon="🎯"
        color="#F59E0B"
        subtitle={t("savedAmount")}
      />

    </div>
  );
}

export default DashboardCards;