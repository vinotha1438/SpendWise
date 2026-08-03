import { Pencil, Trash2 } from "lucide-react";

function RecurringTable({
  recurringExpenses = [],
  onEdit,
  onDelete,
}) {
  if (recurringExpenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-700">
          No Recurring Expenses
        </h2>

        <p className="text-slate-500 mt-3">
          Add your first recurring expense.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-5 py-4 text-left">
              Title
            </th>

            <th className="px-5 py-4 text-left">
              Category
            </th>

            <th className="px-5 py-4 text-right">
              Amount
            </th>

            <th className="px-5 py-4 text-left">
              Frequency
            </th>

            <th className="px-5 py-4 text-left">
              Payment
            </th>

            <th className="px-5 py-4 text-left">
              Next Due
            </th>

            <th className="px-5 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {recurringExpenses.map((item) => (

            <tr
              key={item.id}
              className="border-t hover:bg-slate-50 transition"
            >

              <td className="px-5 py-4 font-semibold">
                {item.title}
              </td>

              <td className="px-5 py-4">
                {item.category}
              </td>

              <td className="px-5 py-4 text-right font-bold text-emerald-600">
                ₹
                {Number(item.amount).toLocaleString(
                  "en-IN"
                )}
              </td>

              <td className="px-5 py-4">
                {item.frequency}
              </td>

              <td className="px-5 py-4">
                {item.payment_method}
              </td>

              <td className="px-5 py-4">
                {new Date(
                  item.next_due_date
                ).toLocaleDateString("en-IN")}
              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(item.id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <Trash2 size={16} />
                    Delete
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

export default RecurringTable;