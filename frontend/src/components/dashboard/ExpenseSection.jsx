import TransactionTable from "../transaction/TransactionTable";

function ExpenseSection({
  expenses,
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  onDelete,
  onEdit,
}) {
  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div className="min-w-0">

          <h2 className="text-2xl font-bold text-slate-800">
            Expense History
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            View, search and manage all your expenses.
          </p>

        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto">

          <input
            type="text"
            placeholder="🔍 Search expense..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-emerald-500
              focus:ring-2
              focus:ring-emerald-500
            "
          />

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              py-3
              outline-none
              transition
              focus:border-emerald-500
              focus:ring-2
              focus:ring-emerald-500
            "
          >
            <option value="">
              All Categories
            </option>

            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Education</option>
            <option>Office</option>
            <option>Home</option>
            <option>Others</option>
          </select>

        </div>

      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">

        <TransactionTable
          expenses={expenses}
          onDelete={onDelete}
          onEdit={onEdit}
        />

      </div>

    </section>
  );
}

export default ExpenseSection;