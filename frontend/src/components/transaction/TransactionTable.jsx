function TransactionTable({ expenses, onDelete }) {
  return (
    <div
      style={{
        marginTop: "30px",
        background: "white",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h2>Recent Transactions</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th align="left">Title</th>
            <th align="left">Category</th>
            <th align="left">Payment</th>
            <th align="left">Amount</th>
            <th align="left">Date</th>
            <th align="left">Action</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.title}</td>
              <td>{expense.category}</td>
              <td>{expense.payment_method}</td>
              <td>₹ {expense.amount}</td>
              <td>{expense.expense_date}</td>

              <td>
                <button
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
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;