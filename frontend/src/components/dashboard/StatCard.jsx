function StatCard({ title, amount, color, isCurrency = true }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        minWidth: "220px",
        flex: 1,
      }}
    >
      <p
        style={{
          color: "#64748B",
          fontSize: "14px",
          marginBottom: "10px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          color: color,
          fontSize: "28px",
        }}
      >
        {isCurrency ? `₹ ${amount}` : amount}
      </h2>
    </div>
  );
}

export default StatCard;