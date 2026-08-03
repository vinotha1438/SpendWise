import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExportPDF({ expenses = [], income = [] }) {
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SpendWise Financial Report", 14, 20);

    const totalIncome = income.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const totalExpense = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    doc.setFontSize(11);

    doc.text(`Total Income : ₹${totalIncome.toLocaleString("en-IN")}`, 14, 35);
    doc.text(`Total Expense : ₹${totalExpense.toLocaleString("en-IN")}`, 14, 43);
    doc.text(
      `Net Balance : ₹${(totalIncome - totalExpense).toLocaleString("en-IN")}`,
      14,
      51
    );

    autoTable(doc, {
      startY: 60,
      head: [["Title", "Category", "Amount", "Payment", "Date"]],
      body: expenses.map((item) => [
        item.title,
        item.category,
        `₹${Number(item.amount).toLocaleString("en-IN")}`,
        item.payment_method,
        item.expense_date
          ? new Date(item.expense_date).toLocaleDateString("en-IN")
          : "-",
      ]),
    });

    doc.save("SpendWise_Report.pdf");
  };

  return (
    <button
      onClick={exportPDF}
      className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 transition"
    >
      📄 Export PDF
    </button>
  );
}

export default ExportPDF;