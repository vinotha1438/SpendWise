function UpcomingPayments({
  recurringExpenses = [],
}) {
  const today = new Date();

  const sortedExpenses = [...recurringExpenses].sort(
    (a, b) =>
      new Date(a.next_due_date) -
      new Date(b.next_due_date)
  );

  const getStatus = (date) => {
    const dueDate = new Date(date);

    dueDate.setHours(0, 0, 0, 0);

    const current = new Date(today);
    current.setHours(0, 0, 0, 0);

    const diff =
      (dueDate - current) /
      (1000 * 60 * 60 * 24);

    if (diff < 0) {
      return {
        label: "Overdue",
        color: "bg-red-100 text-red-600",
      };
    }

    if (diff === 0) {
      return {
        label: "Today",
        color: "bg-yellow-100 text-yellow-700",
      };
    }

    if (diff === 1) {
      return {
        label: "Tomorrow",
        color: "bg-blue-100 text-blue-700",
      };
    }

    return {
      label: `${diff} Days Left`,
      color: "bg-green-100 text-green-700",
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <h2 className="text-2xl font-bold mb-6">
        🔔 Upcoming Payments
      </h2>

      {sortedExpenses.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No recurring expenses found.
        </div>
      ) : (
        <div className="space-y-4">

          {sortedExpenses.map((item) => {
            const status = getStatus(
              item.next_due_date
            );

            return (
              <div
                key={item.id}
                className="flex justify-between items-center border rounded-xl p-4 hover:bg-slate-50 transition"
              >
                <div>

                  <h3 className="font-semibold text-slate-800">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.category}
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Due :
                    {" "}
                    {new Date(
                      item.next_due_date
                    ).toLocaleDateString("en-IN")}
                  </p>

                </div>

                <div className="text-right">

                  <h3 className="text-xl font-bold text-emerald-600">
                    ₹
                    {Number(
                      item.amount
                    ).toLocaleString("en-IN")}
                  </h3>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                  >
                    {status.label}
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

export default UpcomingPayments;