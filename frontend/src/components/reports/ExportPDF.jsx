import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExportPDF({
  expenses = [],
  income = [],
}) {
  const exportPDF = () => {
    if (
      expenses.length === 0 &&
      income.length === 0
    ) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF();

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

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SpendWise Financial Report", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Generated: ${new Date().toLocaleString(
        "en-IN"
      )}`,
      14,
      28
    );

    autoTable(doc, {
      startY: 38,
      head: [
        [
          "Summary",
          "Amount",
        ],
      ],
      body: [
        [
          "Total Income",
          `Rs. ${totalIncome.toLocaleString(
            "en-IN"
          )}`,
        ],
        [
          "Total Expense",
          `Rs. ${totalExpense.toLocaleString(
            "en-IN"
          )}`,
        ],
        [
          "Net Balance",
          `Rs. ${netBalance.toLocaleString(
            "en-IN"
          )}`,
        ],
        [
          "Income Records",
          income.length,
        ],
        [
          "Expense Records",
          expenses.length,
        ],
      ],
    });

    let currentY =
      doc.lastAutoTable.finalY + 15;

    if (expenses.length > 0) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(
        "Expense Report",
        14,
        currentY
      );

      const expenseRows = expenses.map(
        (item) => [
          item.title || "-",
          item.category || "-",
          `Rs. ${Number(
            item.amount || 0
          ).toLocaleString("en-IN")}`,
          item.payment_method || "-",
          item.expense_date
            ? new Date(
                item.expense_date
              ).toLocaleDateString(
                "en-IN"
              )
            : "-",
        ]
      );

      autoTable(doc, {
        startY: currentY + 6,
        head: [
          [
            "Title",
            "Category",
            "Amount",
            "Payment",
            "Date",
          ],
        ],
        body: expenseRows,
        styles: {
          fontSize: 8,
        },
        headStyles: {
          fontStyle: "bold",
        },
      });

      currentY =
        doc.lastAutoTable.finalY + 15;
    }

    if (income.length > 0) {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(
        "Income Report",
        14,
        currentY
      );

      const incomeRows = income.map(
        (item) => [
          item.title || "-",
          item.category || "-",
          `Rs. ${Number(
            item.amount || 0
          ).toLocaleString("en-IN")}`,
          item.payment_method || "-",
          item.income_date
            ? new Date(
                item.income_date
              ).toLocaleDateString(
                "en-IN"
              )
            : "-",
        ]
      );

      autoTable(doc, {
        startY: currentY + 6,
        head: [
          [
            "Title",
            "Category",
            "Amount",
            "Payment",
            "Date",
          ],
        ],
        body: incomeRows,
        styles: {
          fontSize: 8,
        },
        headStyles: {
          fontStyle: "bold",
        },
      });
    }

    const fileDate = new Date()
      .toISOString()
      .split("T")[0];

    doc.save(
      `SpendWise_Report_${fileDate}.pdf`
    );
  };

  return (
    <button
      type="button"
      onClick={exportPDF}
      className="w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 sm:w-auto"
    >
      📄 Export PDF
    </button>
  );
}

export default ExportPDF;