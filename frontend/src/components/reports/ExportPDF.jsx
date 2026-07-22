import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExportPDF({ expenses }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("SpendWise Expense Report", 14, 20);

    const tableData = expenses.map((expense) => [
      expense.title,
      expense.category,
      expense.payment_method,
      `₹${expense.amount}`,
      expense.expense_date
        ? new Date(expense.expense_date).toLocaleDateString()
        : "-",
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Title", "Category", "Payment", "Amount", "Date"]],
      body: tableData,
    });

    const total = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    doc.text(
      `Total Expense: ₹${total.toLocaleString()}`,
      14,
      doc.lastAutoTable.finalY + 15
    );

    doc.save("SpendWise_Expense_Report.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      style={{
        background: "#2563EB",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "20px",
      }}
    >
      📄 Export PDF
    </button>
  );
}

export default ExportPDF;