function TransactionTable({ expenses, onDelete, onEdit }) {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "16px",
        padding: "20px",
        color: "white",
        border: "1px solid #1F2937",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Recent Transactions</h2>

        <span
          style={{
            color: "#94A3B8",
            fontSize: "14px",
          }}
        >
          {expenses.length} Transactions
        </span>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #374151",
            }}
          >
            <th
              align="left"
              style={{ padding: "12px", color: "#9CA3AF" }}
            >
              Title
            </th>

            <th
              align="left"
              style={{ padding: "12px", color: "#9CA3AF" }}
            >
              Category
            </th>

            <th
              align="left"
              style={{ padding: "12px", color: "#9CA3AF" }}
            >
              Payment
            </th>

            <th
              align="left"
              style={{ padding: "12px", color: "#9CA3AF" }}
            >
              Amount
            </th>

            <th
              align="left"
              style={{ padding: "12px", color: "#9CA3AF" }}
            >
              Date
            </th>

            <th
              align="center"
              style={{ padding: "12px", color: "#9CA3AF" }}
            >
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#94A3B8",
                }}
              >
                No Transactions Found
              </td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr
                key={expense.id}
                style={{
                  borderBottom: "1px solid #1F2937",
                }}
              >
                <td style={{ padding: "14px" }}>{expense.title}</td>

                <td style={{ padding: "14px" }}>
                  {expense.category}
                </td>

                <td style={{ padding: "14px" }}>
                  {expense.payment_method}
                </td>

                <td
                  style={{
                    padding: "14px",
                    color: "#EF4444",
                    fontWeight: "bold",
                  }}
                >
                  ₹ {expense.amount}
                </td>

                <td style={{ padding: "14px" }}>
                  {new Date(expense.expense_date).toLocaleDateString()}
                </td>

                <td
                  style={{
                    padding: "14px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => onEdit(expense)}
                    style={{
                      background: "#3B82F6",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(expense.id)}
                    style={{
                      background: "#EF4444",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;