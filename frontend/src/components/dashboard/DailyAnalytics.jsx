function DailyAnalytics({ expenses }) {
  const today = new Date();

  const todayString = today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const yesterdayString = yesterday.toDateString();

  const todayExpense = expenses
    .filter(
      (item) =>
        new Date(item.date).toDateString() === todayString
    )
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const yesterdayExpense = expenses
    .filter(
      (item) =>
        new Date(item.date).toDateString() ===
        yesterdayString
    )
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const last7Days = expenses
    .filter((item) => {
      const diff =
        (today - new Date(item.date)) /
        (1000 * 60 * 60 * 24);

      return diff <= 7;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const thisMonth = expenses
    .filter((item) => {
      const d = new Date(item.date);

      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const avg =
    last7Days === 0
      ? 0
      : Math.round(last7Days / 7);

  const cards = [
    {
      title: "Today's Expense",
      value: todayExpense,
      icon: "📅",
    },
    {
      title: "Yesterday",
      value: yesterdayExpense,
      icon: "📆",
    },
    {
      title: "Last 7 Days",
      value: last7Days,
      icon: "📊",
    },
    {
      title: "This Month",
      value: thisMonth,
      icon: "📈",
    },
    {
      title: "Average / Day",
      value: avg,
      icon: "💸",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "20px",
            boxShadow:
              "0 5px 15px rgba(0,0,0,.08)",
          }}
        >
          <div
            style={{
              fontSize: "28px",
            }}
          >
            {card.icon}
          </div>

          <p
            style={{
              color: "#64748B",
              marginTop: "10px",
            }}
          >
            {card.title}
          </p>

          <h2
            style={{
              marginTop: "8px",
              color: "#0F172A",
            }}
          >
            ₹{card.value.toLocaleString()}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default DailyAnalytics;
