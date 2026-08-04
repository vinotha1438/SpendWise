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
    <div
      className="
        w-full
        h-full
        relative
        overflow-hidden
        rounded-3xl
        bg-white
        border
        border-slate-200
        shadow-md
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        p-6
        flex
        flex-col
        justify-between
      "
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex-1 min-w-0">

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 break-words text-2xl font-bold text-slate-800 lg:text-3xl">
            {isNumber
              ? `₹${amount.toLocaleString("en-IN")}`
              : amount}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            {subtitle}
          </p>

          {change && (
            <div
              className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                changeType === "positive"
                  ? "bg-emerald-100 text-emerald-700"
                  : changeType === "negative"
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-600"
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