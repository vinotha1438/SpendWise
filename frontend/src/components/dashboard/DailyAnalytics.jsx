function DailyAnalytics({ expenses = [] }) {
  const today = new Date();

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayExpense = expenses
    .filter((e) => isSameDay(new Date(e.expense_date), today))
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const yesterdayExpense = expenses
    .filter((e) => isSameDay(new Date(e.expense_date), yesterday))
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const last7DaysExpense = expenses
    .filter((e) => {
      const date = new Date(e.expense_date);
      const diff =
        (today - date) / (1000 * 60 * 60 * 24);

      return diff >= 0 && diff <= 7;
    })
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const thisMonthExpense = expenses
    .filter((e) => {
      const date = new Date(e.expense_date);

      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const averagePerDay =
    expenses.length > 0
      ? Math.round(thisMonthExpense / new Date().getDate())
      : 0;

  const cards = [
    {
      title: "Today's Expense",
      value: todayExpense,
      icon: "📅",
    },
    {
      title: "Yesterday",
      value: yesterdayExpense,
      icon: "🗓️",
    },
    {
      title: "Last 7 Days",
      value: last7DaysExpense,
      icon: "📊",
    },
    {
      title: "This Month",
      value: thisMonthExpense,
      icon: "📈",
    },
    {
      title: "Average / Day",
      value: averagePerDay,
      icon: "💸",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl shadow-md p-5"
        >
          <div className="text-2xl">
            {card.icon}
          </div>

          <p className="text-slate-500 mt-2">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{card.value.toLocaleString("en-IN")}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default DailyAnalytics;