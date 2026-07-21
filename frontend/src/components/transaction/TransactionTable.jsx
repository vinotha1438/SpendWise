function TransactionTable({
  expenses = [],
  onEdit,
  onDelete,
}) {
  if (expenses.length === 0) {
    return (
      <div
        style={{
          color: "#94A3B8",
          textAlign: "center",
          padding: "30px",
        }}
      >
        No Expenses Found
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "white",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #374151",
            }}
          >
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Payment</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              style={{
                borderBottom: "1px solid #1F2937",
              }}
            >
              <td style={tdStyle}>{expense.title}</td>
              <td style={tdStyle}>{expense.category}</td>
              <td style={tdStyle}>{expense.payment_method}</td>
              <td
                style={{
                  ...tdStyle,
                  color: "#EF4444",
                  fontWeight: "bold",
                }}
              >
                ₹{Number(expense.amount).toLocaleString()}
              </td>
              <td style={tdStyle}>
                {expense.expense_date
                  ? new Date(expense.expense_date).toLocaleDateString()
                  : "-"}
              </td>

              <td style={tdStyle}>
                <button
                  onClick={() =>{
                    alert("Edit button clicked");
                    onEdit(expense);
                  }}
                style={{
                  background: "#3B82F6",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginRight: "8px",
                }}
                >
                ✏️ Edit
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this expense?"
                    )
                  ) {
                    onDelete(expense.id);
                  }
                }}
                style={{
                  background: "#EF4444",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </td>
            </tr>
          ))}
      </tbody>
    </table>
    </div >
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px",
  color: "#CBD5E1",
};

const tdStyle = {
  padding: "12px",
};

export default TransactionTable;