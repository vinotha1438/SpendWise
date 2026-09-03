import { useTranslation } from "react-i18next";

function SpendingInsights({ expenses = [] }) {
  const { t } = useTranslation();

  if (!expenses.length) return null;

  const total = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const categoryTotals = {};

  expenses.forEach((item) => {
    const category = item.category || "Others";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(item.amount || 0);
  });

  const highestCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const average = Math.round(total / expenses.length);

  return (
    <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm">

      <h2 className="mb-5 text-xl font-bold text-card-foreground">
        🧠 {t("spendingInsights")}
      </h2>

      <div className="flex flex-col gap-3">

        <div className="text-foreground">
          💰 {t("totalSpending")} :
          <strong className="ml-1">
            ₹{total.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="text-foreground">
          📊 {t("averageTransaction")} :
          <strong className="ml-1">
            ₹{average.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="text-foreground">
          🔥 {t("highestSpendingCategory")} :
          <strong className="ml-1">
            {highestCategory[0]} (
            ₹{highestCategory[1].toLocaleString("en-IN")})
          </strong>
        </div>

        <div className="text-emerald-600 dark:text-emerald-400">
          ✅ {t("tip")}:{" "}
          {t("reduceExpenses", {
            category: highestCategory[0],
          })}
        </div>

      </div>

    </section>
  );
}

export default SpendingInsights;