import { useData } from "../../context/DataContext";

function BudgetProgress() {
  // Read from the shared context instead of fetching /api/budgets
  // independently — keeps this in sync with everything else and
  // matches the pattern already used by Dashboard/Analytics/Reports.
  const { expenses, budgets } = useData();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
      <h2 className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">
        🎯 Budget Progress
      </h2>

      {budgets.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">
          No Budgets Found
        </p>
      ) : (
        <div className="space-y-6">
          {budgets.map((budget) => {
            // Only count expenses that fall within THIS budget's own
            // month/year — previously this summed every expense in
            // the category ever recorded, so a monthly budget looked
            // permanently "exceeded" using all-time spending instead
            // of that month's spending.
            const spent = expenses
              .filter((item) => {
                if (item.category !== budget.category) {
                  return false;
                }

                const expenseDate = new Date(
                  item.expense_date
                );

                return (
                  expenseDate.getMonth() + 1 ===
                    Number(budget.month) &&
                  expenseDate.getFullYear() ===
                    Number(budget.year)
                );
              })
              .reduce(
                (sum, item) =>
                  sum + Number(item.amount || 0),
                0
              );

            const monthlyBudget =
              Number(budget.monthly_budget || 0);

            const percentage =
              monthlyBudget > 0
                ? Math.min(
                    (spent / monthlyBudget) * 100,
                    100
                  )
                : 0;

            const remaining =
              monthlyBudget - spent;

            return (
              <div key={budget.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {budget.category}
                  </h3>

                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    ₹{spent.toLocaleString("en-IN")} / ₹
                    {monthlyBudget.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 100
                        ? "bg-red-500"
                        : percentage >= 75
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span
                    className={
                      remaining >= 0
                        ? "text-slate-500 dark:text-slate-400"
                        : "font-medium text-red-500"
                    }
                  >
                    {remaining >= 0
                      ? `Remaining ₹${remaining.toLocaleString(
                          "en-IN"
                        )}`
                      : `Over Budget ₹${Math.abs(
                          remaining
                        ).toLocaleString("en-IN")}`}
                  </span>

                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BudgetProgress;