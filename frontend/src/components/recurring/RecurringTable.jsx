import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

function RecurringTable({
  recurringExpenses = [],
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();

  if (recurringExpenses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-md">
        <h2 className="text-2xl font-bold text-slate-700">
          {t("noRecurringExpenses")}
        </h2>

        <p className="mt-3 text-slate-500">
          {t("addFirstRecurringExpense")}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* MOBILE */}

      <div className="space-y-4 lg:hidden">
        {recurringExpenses.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                {item.title}
              </h2>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {item.category}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {t("amount")}
                </span>

                <span className="font-bold text-emerald-600">
                  ₹
                  {Number(item.amount).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  {t("frequency")}
                </span>

                <span>
                  {t(
                    item.frequency?.toLowerCase(),
                    item.frequency
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  {t("paymentMethod")}
                </span>

                <span>
                  {t(
                    item.payment_method
                      ?.toLowerCase()
                      .replace(" ", ""),
                    item.payment_method
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  {t("nextDue")}
                </span>

                <span>
                  {new Date(
                    item.next_due_date
                  ).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 rounded-xl bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600"
              >
                {t("edit")}
              </button>

              <button
                onClick={() => onDelete(item.id)}
                className="flex-1 rounded-xl bg-red-500 py-2 font-semibold text-white hover:bg-red-600"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP */}

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md lg:block">
        <table className="min-w-[950px] w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="whitespace-nowrap px-5 py-4 text-left">
                {t("title")}
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-left">
                {t("category")}
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-right">
                {t("amount")}
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-left">
                {t("frequency")}
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-left">
                {t("paymentMethod")}
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-left">
                {t("nextDue")}
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-center">
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {recurringExpenses.map((item) => (
              <tr
                key={item.id}
                className="border-t transition hover:bg-slate-50"
              >
                <td className="whitespace-nowrap px-5 py-4 font-semibold">
                  {item.title}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {item.category}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-emerald-600">
                  ₹
                  {Number(item.amount).toLocaleString(
                    "en-IN"
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {t(
                    item.frequency?.toLowerCase(),
                    item.frequency
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {item.payment_method}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {new Date(
                    item.next_due_date
                  ).toLocaleDateString("en-IN")}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-white transition hover:bg-blue-600"
                    >
                      <Pencil size={16} />

                      <span className="hidden xl:inline">
                        {t("edit")}
                      </span>
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-white transition hover:bg-red-600"
                    >
                      <Trash2 size={16} />

                      <span className="hidden xl:inline">
                        {t("delete")}
                      </span>
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

export default RecurringTable;