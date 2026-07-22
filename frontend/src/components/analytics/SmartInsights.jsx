function SmartInsights({ expenses = [] }) {
  if (expenses.length === 0) {
    return null;
  }

  const amounts = expenses.map((item) => Number(item.amount));

  const totalExpense = amounts.reduce((a, b) => a + b, 0);
  const averageExpense = totalExpense / expenses.length;

  const highestExpense = expenses.reduce((max, item) =>
    Number(item.amount) > Number(max.amount) ? item : max
  );

  const lowestExpense = expenses.reduce((min, item) =>
    Number(item.amount) < Number(min.amount) ? item : min
  );

  const categoryTotals = {};

  expenses.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) + Number(item.amount);
  });

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#111827",
        borderRadius: "16px",
        padding: "25px",
        border: "1px solid #374151",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        💡 Smart Insights
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>🏆 Highest Expense</h3>
          <p>{highestExpense.title}</p>
          <h2>₹{Number(highestExpense.amount).toLocaleString()}</h2>
        </div>

        <div style={cardStyle}>
          <h3>💵 Lowest Expense</h3>
          <p>{lowestExpense.title}</p>
          <h2>₹{Number(lowestExpense.amount).toLocaleString()}</h2>
        </div>

        <div style={cardStyle}>
          <h3>📊 Average Expense</h3>
          <h2>₹{averageExpense.toFixed(0)}</h2>
        </div>

        <div style={cardStyle}>
          <h3>🥇 Top Category</h3>
          <p>{topCategory[0]}</p>
          <h2>₹{topCategory[1].toLocaleString()}</h2>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1F2937",
  color: "white",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
};

export default SmartInsights;
