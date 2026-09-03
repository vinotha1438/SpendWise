import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <section className="mb-8">

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("expenseHistory")}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {t("expenseHistoryDescription")}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

          <input
            type="text"
            placeholder={t("searchExpense")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 sm:w-72"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 sm:w-56"
          >
            <option value="">{t("allCategories")}</option>
            <option value="Food">{t("food")}</option>
            <option value="Travel">{t("travel")}</option>
            <option value="Shopping">{t("shopping")}</option>
            <option value="Bills">{t("bills")}</option>
            <option value="Entertainment">{t("entertainment")}</option>
            <option value="Health">{t("health")}</option>
            <option value="Education">{t("education")}</option>
            <option value="Office">{t("office")}</option>
            <option value="Home">{t("home")}</option>
            <option value="Others">{t("others")}</option>
          </select>

        </div>

      </div>

      <TransactionTable
        expenses={expenses}
        onDelete={onDelete}
        onEdit={onEdit}
      />

    </section>
  );
}

export default ExpenseSection;