import { Target, Calendar } from "lucide-react";

function GoalCard({
  goal,
  onEdit,
  onDelete,
  onAddMoney,
}) {
  const target = Number(goal.target_amount || 0);
  const saved = Number(goal.saved_amount || 0);

  const percentage =
    target > 0
      ? Math.min((saved / target) * 100, 100)
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
            <Target
              className="text-emerald-600"
              size={24}
            />
          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-800">
              {goal.goal_name}
            </h2>

            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <Calendar size={14} />
              {goal.target_date
                ? new Date(goal.target_date).toLocaleDateString(
                    "en-IN"
                  )
                : "-"}
            </div>

          </div>

        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          {percentage.toFixed(0)}%
        </span>

      </div>

      {/* Progress */}

      <div className="mt-6">

        <div className="mb-2 flex justify-between text-sm">

          <span>Saved</span>

          <span className="font-semibold text-emerald-600">
            ₹{saved.toLocaleString("en-IN")}
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

        <div className="mt-3 flex justify-between text-sm text-slate-600">

          <span>
            Target ₹
            {target.toLocaleString("en-IN")}
          </span>

          <span>
            Remaining ₹
            {(target - saved).toLocaleString("en-IN")}
          </span>

        </div>

      </div>

      {/* Buttons */}

      <div className="mt-6 flex gap-3">

        <button
          onClick={() => onAddMoney(goal)}
          className="flex-1 rounded-xl bg-emerald-500 py-2 font-semibold text-white transition hover:bg-emerald-600"
        >
          Add Money
        </button>

        <button
          onClick={() => onEdit(goal)}
          className="rounded-xl bg-blue-100 px-4 py-2 font-medium text-blue-700 transition hover:bg-blue-200"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(goal.id)}
          className="rounded-xl bg-red-100 px-4 py-2 font-medium text-red-600 transition hover:bg-red-200"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default GoalCard;