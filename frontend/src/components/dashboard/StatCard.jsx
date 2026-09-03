function StatCard({
  title,
  amount,
  icon,
  color,
  subtitle,
  change,
  changeType,
}) {
  const isNumber = typeof amount === "number";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors">

      <div className="flex items-center justify-between gap-4">

        <div className="min-w-0 flex-1">

          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-3 break-words text-2xl font-bold text-card-foreground lg:text-3xl">
            {isNumber
              ? `₹${amount.toLocaleString("en-IN")}`
              : amount}
          </h2>

          <p className="mt-2 text-xs text-muted-foreground">
            {subtitle}
          </p>

          {change && (
            <div
              className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                changeType === "positive"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : changeType === "negative"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {change}
            </div>
          )}

        </div>

        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-3xl text-white shadow-lg"
          style={{
            background: color,
          }}
        >
          {icon}
        </div>

      </div>

      <div
        className="absolute bottom-0 left-0 h-1 w-full"
        style={{
          background: color,
        }}
      />

    </div>
  );
}

export default StatCard;