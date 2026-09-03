import { useTranslation } from "react-i18next";
import IncomeTable from "../transaction/IncomeTable";

function IncomeSection({
  income,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();

  return (
    <section className="mb-8">

      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-foreground">
          {t("incomeHistory")}
        </h2>

        <p className="text-sm text-muted-foreground">
          {t("viewManageEditIncome")}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <IncomeTable
          income={income}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

    </section>
  );
}

export default IncomeSection;