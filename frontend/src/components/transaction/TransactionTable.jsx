import { Pencil, Trash2 } from "lucide-react";

function TransactionTable({
  expenses = [],
  onEdit,
  onDelete,
}) {
  if (expenses.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-xl font-semibold text-slate-700">
          No Expenses Found
        </h3>

        <p className="mt-2 text-slate-500">
          Add your first expense to start tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

      <table className="w-full min-w-[700px] lg:min-w-full border-collapse">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
              Title
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
              Category
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
              Payment
            </th>

            <th className="px-5 py-4 text-right text-sm font-semibold text-slate-700 whitespace-nowrap">
              Amount
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
              Date
            </th>

            <th className="px-5 py-4 text-center text-sm font-semibold text-slate-700 whitespace-nowrap">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {expenses.map((expense) => (

            <tr
              key={expense.id}
              className="border-t border-slate-200 transition hover:bg-slate-50"
            >

              <td className="px-5 py-4 font-medium text-slate-800 whitespace-nowrap">
                {expense.title}
              </td>

              <td className="px-5 py-4 whitespace-nowrap">

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {expense.category}
                </span>

              </td>

              <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                {expense.payment_method}
              </td>

              <td className="px-5 py-4 text-right font-bold text-red-500 whitespace-nowrap">
                ₹
                {Number(expense.amount).toLocaleString(
                  "en-IN"
                )}
              </td>

              <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                {expense.expense_date
                  ? new Date(
                    expense.expense_date
                  ).toLocaleDateString("en-IN")
                  : "-"}
              </td>

              <td className="px-5 py-4">

                <div className="flex items-center justify-center gap-2">

                  <button
                    onClick={() => onEdit(expense)}
                    className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-2 text-white transition hover:bg-blue-600"
                  >
                    <Pencil size={16} />
                    <span className="hidden sm:inline">
                      Edit
                    </span>
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
                    className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-white transition hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">
                      Delete
                    </span>
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>
      </table>

    </div>
  );
}

export default TransactionTable;