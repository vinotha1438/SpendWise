import * as XLSX from "xlsx";

function ExportExcel({
  expenses = [],
  income = [],
}) {
  const exportExcel = () => {
    const expenseData = expenses.map((item) => ({
      Type: "Expense",
      Title: item.title || "",
      Category: item.category || "",
      Amount: Number(item.amount || 0),
      "Payment Method":
        item.payment_method || "",
      Date: item.expense_date
        ? new Date(
            item.expense_date
          ).toLocaleDateString("en-IN")
        : "",
      Notes: item.notes || "",
    }));

    const incomeData = income.map((item) => ({
      Type: "Income",
      Title: item.title || "",
      Category: item.category || "",
      Amount: Number(item.amount || 0),
      "Payment Method":
        item.payment_method || "",
      Date: item.income_date
        ? new Date(
            item.income_date
          ).toLocaleDateString("en-IN")
        : "",
      Notes: item.notes || "",
    }));

    const allData = [
      ...expenseData,
      ...incomeData,
    ];

    if (allData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const totalIncome = income.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

    const totalExpense = expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

    const netBalance =
      totalIncome - totalExpense;

    const summaryData = [
      {
        "Report Summary": "Total Income",
        Amount: totalIncome,
      },
      {
        "Report Summary": "Total Expense",
        Amount: totalExpense,
      },
      {
        "Report Summary": "Net Balance",
        Amount: netBalance,
      },
      {
        "Report Summary": "Total Income Records",
        Amount: income.length,
      },
      {
        "Report Summary": "Total Expense Records",
        Amount: expenses.length,
      },
    ];

    const workbook = XLSX.utils.book_new();

    const summarySheet =
      XLSX.utils.json_to_sheet(summaryData);

    const transactionSheet =
      XLSX.utils.json_to_sheet(allData);

    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Summary"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      transactionSheet,
      "Transactions"
    );

    summarySheet["!cols"] = [
      {
        wch: 28,
      },
      {
        wch: 18,
      },
    ];

    transactionSheet["!cols"] = [
      {
        wch: 14,
      },
      {
        wch: 25,
      },
      {
        wch: 18,
      },
      {
        wch: 15,
      },
      {
        wch: 20,
      },
      {
        wch: 15,
      },
      {
        wch: 35,
      },
    ];

    const today = new Date();

    const fileDate = today
      .toISOString()
      .split("T")[0];

    XLSX.writeFile(
      workbook,
      `SpendWise_Report_${fileDate}.xlsx`
    );
  };

  return (
    <button
      type="button"
      onClick={exportExcel}
      className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
    >
      📊 Export Excel
    </button>
  );
}

export default ExportExcel;