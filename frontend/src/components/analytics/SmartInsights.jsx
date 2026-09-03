import { useMemo } from "react";

function SmartInsights({ expenses = [] }) {
  const insights = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return [];
    }

    const categoryTotals = {};

    expenses.forEach((item) => {
      const category = item.category || "Others";
      const amount = Number(item.amount || 0);

      categoryTotals[category] =
        (categoryTotals[category] || 0) + amount;
    });

    const totalExpense = expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

    const sortedCategories = Object.entries(
      categoryTotals
    ).sort((a, b) => b[1] - a[1]);

    const result = [];

    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] =
        sortedCategories[0];

      const percentage =
        totalExpense > 0
          ? ((topAmount / totalExpense) * 100).toFixed(
              1
            )
          : 0;

      result.push({
        type: "warning",
        icon: "💡",
        title: "Highest Spending Category",
        message: `${topCategory} is your highest spending category with ₹${topAmount.toLocaleString(
          "en-IN"
        )} (${percentage}% of total expenses).`,
      });
    }

    if (totalExpense > 0) {
      const averageExpense =
        totalExpense / expenses.length;

      result.push({
        type: "info",
        icon: "📊",
        title: "Average Transaction",
        message: `Your average expense transaction is ₹${averageExpense.toLocaleString(
          "en-IN",
          {
            maximumFractionDigits: 0,
          }
        )}.`,
      });
    }

    const today = new Date();

    const recentExpenses = expenses.filter((item) => {
      if (!item.expense_date) return false;

      const date = new Date(item.expense_date);

      if (Number.isNaN(date.getTime())) return false;

      const difference =
        today.getTime() - date.getTime();

      const days =
        difference / (1000 * 60 * 60 * 24);

      return days >= 0 && days <= 7;
    });

    if (recentExpenses.length > 0) {
      const recentTotal = recentExpenses.reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      );

      result.push({
        type: "success",
        icon: "📅",
        title: "Last 7 Days",
        message: `You spent ₹${recentTotal.toLocaleString(
          "en-IN"
        )} during the last 7 days.`,
      });
    }

    const highestExpense = expenses.reduce(
      (highest, item) => {
        const amount = Number(item.amount || 0);

        return amount > Number(highest?.amount || 0)
          ? item
          : highest;
      },
      null
    );

    if (highestExpense) {
      result.push({
        type: "danger",
        icon: "💸",
        title: "Largest Transaction",
        message: `Your largest expense was ₹${Number(
          highestExpense.amount || 0
        ).toLocaleString("en-IN")} for ${
          highestExpense.title || "an expense"
        }.`,
      });
    }

    return result;
  }, [expenses]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          🧠 Smart Insights
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Helpful insights based on your spending activity.
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-8 text-center">
          <div className="text-4xl">
            📊
          </div>

          <p className="mt-3 font-semibold text-slate-700">
            Not enough data yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Add some expenses to see smart insights.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {insights.map((insight, index) => {
            const styles = {
              warning:
                "border-amber-200 bg-amber-50",
              info:
                "border-blue-200 bg-blue-50",
              success:
                "border-emerald-200 bg-emerald-50",
              danger:
                "border-red-200 bg-red-50",
            };

            return (
              <div
                key={`${insight.title}-${index}`}
                className={`rounded-xl border p-5 ${
                  styles[insight.type] ||
                  "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {insight.icon}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800">
                      {insight.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SmartInsights;