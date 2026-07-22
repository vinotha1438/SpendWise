import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ExportExcel({ expenses }) {
  const exportExcel = () => {
    const data = expenses.map((expense) => ({
      Title: expense.title,
      Category: expense.category,
      Payment: expense.payment_method,
      Amount: expense.amount,
      Date: expense.expense_date
        ? new Date(expense.expense_date).toLocaleDateString()
        : "-",
    }));

    const total = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    data.push({
      Title: "",
      Category: "",
      Payment: "Total Expense",
      Amount: total,
      Date: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Expenses"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "SpendWise_Expense_Report.xlsx");
  };

  return (
    <button
      onClick={exportExcel}
      style={{
        background: "#16A34A",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "20px",
        marginLeft: "10px",
      }}
    >
      📊 Export Excel
    </button>
  );
}

export default ExportExcel;