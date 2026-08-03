function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center px-6">

      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-14 items-center">

        {/* LEFT */}

        <div className="hidden lg:block text-white">

          <h1 className="text-6xl font-extrabold leading-tight">
            SpendWise
          </h1>

          <p className="text-emerald-400 mt-4 text-2xl font-semibold">
            Personal Finance Dashboard
          </p>

          <p className="mt-8 text-slate-300 text-lg leading-8 max-w-xl">

            Track your income,
            expenses,
            savings,
            budgets,
            reports and financial goals in one beautiful dashboard.

          </p>

          <div className="grid grid-cols-2 gap-5 mt-12">

            <div className="rounded-2xl bg-white/10 backdrop-blur p-5">
              <div className="text-4xl">💰</div>

              <h3 className="mt-3 font-bold">
                Expense Tracking
              </h3>

              <p className="text-sm text-slate-300 mt-2">
                Monitor every rupee you spend.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur p-5">
              <div className="text-4xl">📈</div>

              <h3 className="mt-3 font-bold">
                Analytics
              </h3>

              <p className="text-sm text-slate-300 mt-2">
                Beautiful charts & reports.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur p-5">
              <div className="text-4xl">🎯</div>

              <h3 className="mt-3 font-bold">
                Goals
              </h3>

              <p className="text-sm text-slate-300 mt-2">
                Reach your savings target.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur p-5">
              <div className="text-4xl">📄</div>

              <h3 className="mt-3 font-bold">
                Reports
              </h3>

              <p className="text-sm text-slate-300 mt-2">
                Export PDF & Excel instantly.
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-white rounded-3xl shadow-2xl p-10">

          <h2 className="text-4xl font-bold text-slate-800 text-center">
            {title}
          </h2>

          <p className="text-center text-slate-500 mt-3">
            {subtitle}
          </p>

          <div className="mt-8">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}

export default AuthLayout;