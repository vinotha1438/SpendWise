function IncomeTable({ income = [], onEdit, onDelete }) {
  if (income.length === 0) {
    return (
      <div
        style={{
          marginTop: "30px",
          background: "#111827",
          padding: "20px",
          borderRadius: "15px",
          border: "1px solid #1F2937",
          color: "white",
          textAlign: "center",
        }}
      >
        No Income Found
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "30px",
        background: "#111827",
        padding: "20px",
        borderRadius: "15px",
        border: "1px solid #1F2937",
        overflowX: "auto",
      }}
    >
      <h2
        style={{
          color: "white",
          fontSize: "24px",
          marginBottom: "20px",
        }}
      >
        💰 Income History
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "white",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Payment</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {income.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.title}</td>
              <td style={tdStyle}>{item.category}</td>
              <td style={tdStyle}>{item.payment_method}</td>

              <td
                style={{
                  ...tdStyle,
                  color: "#22C55E",
                  fontWeight: "bold",
                }}
              >
                ₹{Number(item.amount).toLocaleString()}
              </td>

              <td style={tdStyle}>
                {item.income_date
                  ? new Date(item.income_date).toLocaleDateString()
                  : "-"}
              </td>

              <td style={tdStyle}>
                <button
                  onClick={() => onEdit(item)}
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
                        "Are you sure you want to delete this income?"
                      )
                    ) {
                      onDelete(item.id);
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
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px",
  color: "#CBD5E1",
  borderBottom: "1px solid #374151",
};

const tdStyle = {
  padding: "12px",
  color: "white",
  borderBottom: "1px solid #1F2937",
};

export default IncomeTable;