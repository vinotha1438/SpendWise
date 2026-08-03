function RecurringCard({
  recurringExpenses = [],
}) {
  const totalRecurring = recurringExpenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const monthlyCount = recurringExpenses.filter(
    (item) => item.frequency === "Monthly"
  ).length;

  const weeklyCount = recurringExpenses.filter(
    (item) => item.frequency === "Weekly"
  ).length;

  const yearlyCount = recurringExpenses.filter(
    (item) => item.frequency === "Yearly"
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <h2 className="text-2xl font-bold mb-6">
        🔁 Recurring Summary
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        <div className="bg-slate-50 rounded-xl p-5 text-center">
          <h3 className="text-slate-500 text-sm">
            Total Expenses
          </h3>

          <p className="text-2xl font-bold text-emerald-600 mt-2">
            ₹
            {totalRecurring.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 text-center">
          <h3 className="text-slate-500 text-sm">
            Monthly
          </h3>

          <p className="text-2xl font-bold mt-2">
            {monthlyCount}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 text-center">
          <h3 className="text-slate-500 text-sm">
            Weekly
          </h3>

          <p className="text-2xl font-bold mt-2">
            {weeklyCount}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 text-center">
          <h3 className="text-slate-500 text-sm">
            Yearly
          </h3>

          <p className="text-2xl font-bold mt-2">
            {yearlyCount}
          </p>
        </div>

      </div>

    </div>
  );
}

export default RecurringCard;