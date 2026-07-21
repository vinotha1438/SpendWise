function SpendingInsights({ expenses }) {
  if (!expenses.length) return null;

  const total = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const categoryTotals = {};

  expenses.forEach((item) => {
    const category = item.category || "Others";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(item.amount);
  });

  const highestCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const average = Math.round(total / expenses.length);

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        marginBottom: "25px",
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <h3
        style={{
          marginBottom: "15px",
          color: "#0F172A",
        }}
      >
        🧠 Spending Insights
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div>
          💰 Total Spending :
          <strong> ₹{total.toLocaleString()}</strong>
        </div>

        <div>
          📊 Average Transaction :
          <strong> ₹{average.toLocaleString()}</strong>
        </div>

        <div>
          🔥 Highest Spending Category :
          <strong>
            {" "}
            {highestCategory[0]} (₹
            {highestCategory[1].toLocaleString()})
          </strong>
        </div>

        <div style={{ color: "#16A34A" }}>
          ✅ Tip: Try reducing expenses in{" "}
          <strong>{highestCategory[0]}</strong> to improve your
          monthly savings.
        </div>
      </div>
    </div>
  );
}

export default SpendingInsights;