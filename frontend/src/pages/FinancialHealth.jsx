import { useEffect } from "react";

import { useData } from "../context/DataContext";
import AppLayout from "../components/layout/AppLayout";
import HealthScoreCard from "../components/financialHealth/HealthScoreCard";
import SavingsRateCard from "../components/financialHealth/SavingsRateCard";
import ExpenseRatioCard from "../components/financialHealth/ExpenseRatioCard";
import HealthGauge from "../components/financialHealth/HealthGauge";
import Recommendations from "../components/financialHealth/Recommendations";

function FinancialHealth() {
  // Same expenses/income arrays as Dashboard/Analytics/Reports —
  // no more separate fetch of the same data on this page.
  const { expenses, income, refreshData } = useData();

  // Refresh on mount in case this page is opened directly (e.g. via
  // URL/refresh) without visiting Dashboard first — keeps this page
  // from showing stale/empty data in that case.
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppLayout expenses={expenses} income={income}>
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          ❤️ Financial Health
        </h1>

        <HealthScoreCard
          expenses={expenses}
          income={income}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <SavingsRateCard
            expenses={expenses}
            income={income}
          />

          <ExpenseRatioCard
            expenses={expenses}
            income={income}
          />

        </div>

        <HealthGauge
          expenses={expenses}
          income={income}
        />

        <Recommendations
          expenses={expenses}
          income={income}
        />

      </div>
    </AppLayout>
  );
}

export default FinancialHealth;