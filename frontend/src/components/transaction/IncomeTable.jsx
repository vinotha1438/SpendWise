import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

function IncomeTable({
  income = [],
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();

  if (income.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
        <h3 className="text-xl font-semibold text-slate-700">
          {t("noIncomeFound")}
        </h3>

        <p className="mt-2 text-slate-500">
          {t("addFirstIncome")}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-5 py-4 text-left">
                {t("title")}
              </th>

              <th className="px-5 py-4 text-left">
                {t("category")}
              </th>

              <th className="px-5 py-4 text-left">
                {t("paymentMethod")}
              </th>

              <th className="px-5 py-4 text-right">
                {t("amount")}
              </th>

              <th className="px-5 py-4 text-left">
                {t("date")}
              </th>

              <th className="px-5 py-4 text-center">
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {income.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  {item.title}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.category}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {item.payment_method}
                </td>

                <td className="px-5 py-4 text-right font-bold text-emerald-600">
                  ₹
                  {Number(item.amount).toLocaleString("en-IN")}
                </td>

                <td className="px-5 py-4">
                  {item.income_date
                    ? new Date(
                        item.income_date
                      ).toLocaleDateString("en-IN")
                    : "-"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      title={t("edit")}
                      className="rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            t("confirmDeleteIncome")
                          )
                        ) {
                          onDelete(item.id);
                        }
                      }}
                      title={t("delete")}
                      className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
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

      {/* Mobile */}
      <div className="space-y-4 lg:hidden">
        {income.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">
                {item.title}
              </h3>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {item.category}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>{t("paymentMethod")}:</strong>{" "}
                {item.payment_method}
              </p>

              <p>
                <strong>{t("date")}:</strong>{" "}
                {item.income_date
                  ? new Date(
                      item.income_date
                    ).toLocaleDateString("en-IN")
                  : "-"}
              </p>

              <p className="text-xl font-bold text-emerald-600">
                ₹
                {Number(item.amount).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="flex-1 rounded-xl bg-blue-500 py-2 text-white hover:bg-blue-600"
              >
                {t("edit")}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      t("confirmDeleteIncome")
                    )
                  ) {
                    onDelete(item.id);
                  }
                }}
                className="flex-1 rounded-xl bg-red-500 py-2 text-white hover:bg-red-600"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default IncomeTable;