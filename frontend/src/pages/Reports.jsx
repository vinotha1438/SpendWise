import { useData } from "../context/DataContext";

import AppLayout from "../components/layout/AppLayout";
import ExportPDF from "../components/reports/ExportPDF";
import ExportExcel from "../components/reports/ExportExcel";

function Reports() {
  const { expenses, income } = useData();

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const netBalance = totalIncome - totalExpense;

  const totalTransactions =
    expenses.length + income.length;

  return (
    <AppLayout
      expenses={expenses}
      income={income}
    >
      <div className="p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              📊 Reports
            </h1>

            <p className="mt-2 text-slate-500">
              View and export your financial reports.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <ExportPDF
              expenses={expenses}
              income={income}
            />

            <ExportExcel
              expenses={expenses}
              income={income}
            />

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-slate-500">
              Total Expense
            </p>

            <h2 className="mt-3 text-3xl font-bold text-red-600">
              ₹{totalExpense.toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-slate-500">
              Total Income
            </p>

            <h2 className="mt-3 text-3xl font-bold text-emerald-600">
              ₹{totalIncome.toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-slate-500">
              Net Balance
            </p>

            <h2
              className={`mt-3 text-3xl font-bold ${
                netBalance >= 0
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              ₹{netBalance.toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-slate-500">
              Total Transactions
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              {totalTransactions}
            </h2>

          </div>

        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          <div className="border-b px-6 py-4">

            <h2 className="text-xl font-semibold">
              Expense Report
            </h2>

          </div>

          <div className="overflow-x-auto">

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
                    Payment
                  </th>

                  <th className="px-5 py-4 text-left">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {expenses.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="py-10 text-center text-slate-500"
                    >
                      No Expense Records Found
                    </td>

                  </tr>

                ) : (

                  expenses.map((item) => (

                    <tr
                      key={item.id}
                      className="border-t hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">
                        {item.title}
                      </td>

                      <td className="px-5 py-4">
                        {item.category}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-red-600">
                        ₹
                        {Number(item.amount).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {item.payment_method}
                      </td>

                      <td className="px-5 py-4">
                        {item.expense_date
                          ? new Date(
                              item.expense_date
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}

export default Reports;