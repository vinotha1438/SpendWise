import { useState } from "react";

function AnalyticsFilter({
  value,
  onChange,
  onApplyDateRange,
}) {
  const filters = [
    "All",
    "Today",
    "This Week",
    "This Month",
    "This Year",
  ];

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleApply = () => {
    if (!onApplyDateRange) return;

    onApplyDateRange({
      fromDate,
      toDate,
    });
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");

    if (!onApplyDateRange) return;

    onApplyDateRange({
      fromDate: "",
      toDate: "",
    });
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex flex-col gap-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              📅 Analytics Filter
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Filter analytics by period or custom date range.
            </p>
          </div>

          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 lg:w-60"
          >
            {filters.map((filter) => (
              <option
                key={filter}
                value={filter}
              >
                {filter}
              </option>
            ))}
          </select>

        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleApply}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Apply
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="w-full rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Reset
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsFilter;