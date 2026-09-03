import { useTranslation } from "react-i18next";

function DailyAnalytics({ expenses = [] }) {
  const { t } = useTranslation();

  const today = new Date();

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayExpense = expenses
    .filter((e) =>
      isSameDay(new Date(e.expense_date), today)
    )
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const yesterdayExpense = expenses
    .filter((e) =>
      isSameDay(new Date(e.expense_date), yesterday)
    )
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
      ? Math.round(
          thisMonthExpense / today.getDate()
        )
      : 0;

  const cards = [
    {
      title: t("todaysExpense"),
      value: todayExpense,
      icon: "📅",
    },
    {
      title: t("yesterday"),
      value: yesterdayExpense,
      icon: "🗓️",
    },
    {
      title: t("last7Days"),
      value: last7DaysExpense,
      icon: "📊",
    },
    {
      title: t("thisMonth"),
      value: thisMonthExpense,
      icon: "📈",
    },
    {
      title: t("averagePerDay"),
      value: averagePerDay,
      icon: "💸",
    },
  ];

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <div className="text-4xl">
                {card.icon}
              </div>

              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40" />

            </div>

            <p className="mt-5 text-sm font-medium text-muted-foreground">
              {card.title}
            </p>

            <h2 className="mt-2 break-all text-2xl font-bold text-card-foreground lg:text-3xl">
              ₹{card.value.toLocaleString("en-IN")}
            </h2>

          </div>
        ))}

      </div>
    </section>
  );
}

export default DailyAnalytics;