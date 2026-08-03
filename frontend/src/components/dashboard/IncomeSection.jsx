import IncomeTable from "../transaction/IncomeTable";

function IncomeSection({
  income,
  onEdit,
  onDelete,
}) {
  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-800">
          Income History
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          View, manage and edit all your income records.
        </p>

      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">

        <IncomeTable
          income={income}
          onEdit={onEdit}
          onDelete={onDelete}
        />

      </div>

    </div>
  );
}

export default IncomeSection;