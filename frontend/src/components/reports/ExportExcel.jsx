import * as XLSX from "xlsx";

function ExportExcel({
  expenses = [],
  income = [],
}) {
  const exportExcel = () => {
    const expenseSheet = expenses.map((item) => ({
      Title: item.title,
      Category: item.category,
      Amount: Number(item.amount),
      Payment: item.payment_method,
      Date: item.expense_date
        ? new Date(item.expense_date).toLocaleDateString("en-IN")
        : "-",
      Notes: item.notes || "",
    }));

    const incomeSheet = income.map((item) => ({
      Title: item.title,
      Category: item.category,
      Amount: Number(item.amount),
      Payment: item.payment_method,
      Date: item.income_date
        ? new Date(item.income_date).toLocaleDateString("en-IN")
        : "-",
      Notes: item.notes || "",
    }));

    const wb = XLSX.utils.book_new();

    const expenseWS =
      XLSX.utils.json_to_sheet(expenseSheet);

    const incomeWS =
      XLSX.utils.json_to_sheet(incomeSheet);

    XLSX.utils.book_append_sheet(
      wb,
      expenseWS,
      "Expenses"
    );

    XLSX.utils.book_append_sheet(
      wb,
      incomeWS,
      "Income"
    );

    XLSX.writeFile(
      wb,
      "SpendWise_Report.xlsx"
    );
  };

  return (
    <button
      onClick={exportExcel}
      className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 transition"
    >
      📊 Export Excel
    </button>
  );
}

export default ExportExcel;