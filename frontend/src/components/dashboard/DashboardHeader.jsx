import AddExpenseModal from "../transaction/AddExpenseModal";
import ExportPDF from "../reports/ExportPDF";
import ExportExcel from "../reports/ExportExcel";

function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = new Date().getHours();

  let greeting = "Good Evening 🌙";

  if (hour < 12) greeting = "Good Morning ☀️";
  else if (hour < 17) greeting = "Good Afternoon 🌤️";

  return (
    <section className="mb-8">

      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-700 p-6 shadow-xl">

        <div className="flex flex-col lg:flex-row justify-between gap-6">

          <div>

            <p className="text-emerald-300 font-semibold">
              {greeting}
            </p>

            <h1 className="text-3xl font-bold text-white mt-2">
              Welcome Back 👋
            </h1>

            <p className="text-slate-200 mt-3">
              Track your income, expenses and savings in one place.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white">
              📅 {today}
            </div>

          </div>

          <div className="flex flex-wrap gap-3 self-start lg:self-center">

            <AddExpenseModal />

            <ExportPDF />

            <ExportExcel />

          </div>

        </div>

      </div>

    </section>
  );
}

export default DashboardHeader;