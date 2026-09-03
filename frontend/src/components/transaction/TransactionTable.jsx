import { Pencil, Trash2 } from "lucide-react";

function TransactionTable({
  expenses = [],
  onEdit,
  onDelete,
}) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h3 className="text-xl font-bold text-foreground">
          No Expenses Found
        </h3>

        <p className="mt-2 text-muted-foreground">
          Add your first expense to start tracking.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ================= MOBILE VIEW ================= */}

      <div className="block space-y-4 md:hidden">

        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="
              rounded-2xl
              border border-border
              bg-card
              p-4
              text-card-foreground
              shadow-sm
              transition-colors
            "
          >

            <div className="flex items-center justify-between gap-3">

              <h3 className="break-words font-bold text-foreground">
                {expense.title}
              </h3>

              <span className="shrink-0 font-bold text-red-500">
                ₹
                {Number(expense.amount).toLocaleString("en-IN")}
              </span>

            </div>

            {expense.where_to_pay && (
              <p className="mt-1 text-sm text-muted-foreground">
                Paid to: {expense.where_to_pay}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {expense.category}
              </span>

              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                {expense.payment_method}
              </span>

            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              📅{" "}
              {expense.expense_date
                ? new Date(
                    expense.expense_date
                  ).toLocaleDateString("en-IN")
                : "-"}
            </p>

            <div className="mt-4 flex gap-2">

              <button
                onClick={() => onEdit(expense)}
                className="flex-1 rounded-xl bg-blue-500 py-2 text-white transition hover:bg-blue-600"
              >
                <div className="flex items-center justify-center gap-2">
                  <Pencil size={16} />
                  Edit
                </div>
              </button>

              <button
                onClick={() => {
                  if (window.confirm("Delete this expense?")) {
                    onDelete(expense.id);
                  }
                }}
                className="flex-1 rounded-xl bg-red-500 py-2 text-white transition hover:bg-red-600"
              >
                <div className="flex items-center justify-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </div>
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ================= DESKTOP VIEW ================= */}

      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">

        <table className="w-full border-collapse">

          <thead className="bg-muted">

            <tr className="text-foreground">

              <th className="px-4 py-3 text-left">
                Title
              </th>

              <th className="px-4 py-3 text-left">
                Paid To
              </th>

              <th className="px-4 py-3 text-left">
                Category
              </th>

              <th className="px-4 py-3 text-left">
                Payment
              </th>

              <th className="px-4 py-3 text-right">
                Amount
              </th>

              <th className="px-4 py-3 text-left">
                Date
              </th>

              <th className="px-4 py-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="
                  border-t border-border
                  text-foreground
                  transition-colors
                  hover:bg-muted/50
                "
              >

                <td className="px-4 py-4">
                  {expense.title}
                </td>

                <td className="px-4 py-4 text-muted-foreground">
                  {expense.where_to_pay || "-"}
                </td>

                <td className="px-4 py-4">

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {expense.category}
                  </span>

                </td>

                <td className="px-4 py-4 text-muted-foreground">
                  {expense.payment_method}
                </td>

                <td className="px-4 py-4 text-right font-bold text-red-500">
                  ₹
                  {Number(expense.amount).toLocaleString("en-IN")}
                </td>

                <td className="px-4 py-4 text-muted-foreground">
                  {expense.expense_date
                    ? new Date(
                        expense.expense_date
                      ).toLocaleDateString("en-IN")
                    : "-"}
                </td>

                <td className="px-4 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(expense)}
                      className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Delete this expense?"
                          )
                        ) {
                          onDelete(expense.id);
                        }
                      }}
                      className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}

export default TransactionTable;