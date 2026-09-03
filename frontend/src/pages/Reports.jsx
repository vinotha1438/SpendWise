import { useEffect } from "react";
import { useData } from "../context/DataContext";

import AppLayout from "../components/layout/AppLayout";
import ExportPDF from "../components/reports/ExportPDF";
import ExportExcel from "../components/reports/ExportExcel";
import { GitCommitVertical } from "lucide-react";

function Reports() {
  const { expenses, income, totalBalance, refreshData } = useData();

  // Refresh on mount in case this page is opened directly.
  useEffect(() => {
    refreshData();
  }, []);

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  // Net Balance = income vs expense for the transactions shown here.
  // This is intentionally different from Total Balance below, which
  // is the actual accounts-derived balance (includes opening
  // balances). Two different, both-legitimate numbers — kept
  // clearly separate rather than conflated into one "balance".
  const netBalance = totalIncome - totalExpense;

  const totalTransactions =
    expenses.length + income.length;

  return (
    <AppLayout
      expenses={expenses}
      income={income}
    >
      <div className="p-4 sm:p-6 lg:p-8">

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              📊 Reports
            </h1>

            <p className="mt-2 text-slate-500">
              View and export your financial reports.
            </p>

          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto">

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

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-slate-500">
              Total Expense
            </p>

            <h2 className="mt-3 break-words text-3xl font-bold text-red-600">
              ₹{totalExpense.toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-slate-500">
              Total Income
            </p>

            <h2 className="mt-3 break-words text-3xl font-bold text-emerald-600">
              ₹{totalIncome.toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-slate-500">
              Net Balance
            </p>

            <h2
              className={`mt-3 break-words text-3xl font-bold ${netBalance >= 0
                ? "text-blue-600"
                : "text-red-600"
                }`}
            >
              ₹{netBalance.toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-slate-500">
              Total Balance
            </p>

            <h2 className="mt-3 break-words text-3xl font-bold text-indigo-600">
              ₹{totalBalance.toLocaleString("en-IN")}
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

          {/* Desktop Table */}

          <div className="hidden lg:block overflow-x-auto">

            <table className="w-full">

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
                      colSpan={5}
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

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {item.category}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-right font-bold text-red-600">
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        {item.payment_method}
                      </td>

                      <td className="px-5 py-4">
                        {item.expense_date
                          ? new Date(item.expense_date).toLocaleDateString("en-IN")
                          : "-"}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          {/* Mobile Cards */}

          <div className="space-y-4 p-4 lg:hidden">

            {expenses.length === 0 ? (

              <div className="py-10 text-center text-slate-500">
                No Expense Records Found
              </div>

            ) : (

              expenses.map((item) => (

                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  <div className="flex items-center justify-between gap-3">

                    <h3 className="font-bold text-slate-800 break-words">
                      {item.title}
                    </h3>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {item.category}
                    </span>

                  </div>

                  <div className="mt-4 space-y-2 text-sm">

                    <p>
                      <strong>Payment:</strong>{" "}
                      {item.payment_method}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {item.expense_date
                        ? new Date(item.expense_date).toLocaleDateString("en-IN")
                        : "-"}
                    </p>

                    <p className="text-xl font-bold text-red-600">
                      ₹{Number(item.amount).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </AppLayout>
  );
}

export default Reports;