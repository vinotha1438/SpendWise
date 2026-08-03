import { useData } from "../context/DataContext";

import AppLayout from "../components/layout/AppLayout";
import AnalyticsCards from "../components/analytics/AnalyticsCards";
import IncomeExpenseChart from "../components/analytics/IncomeExpenseChart";
import CategoryPieChart from "../components/analytics/CategoryPieChart";
import MonthlyTrendChart from "../components/analytics/MonthlyTrendChart";
import SmartInsights from "../components/analytics/SmartInsights";

function Analytics() {
  const { expenses, income } = useData();

  return (
    <AppLayout
      expenses={expenses}
      income={income}
    >
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h1 className="text-3xl font-bold text-slate-800">
          📊 Analytics Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Track your financial performance, spending patterns and monthly trends.
        </p>

      </div>

      <AnalyticsCards
        expenses={expenses}
        income={income}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

        <IncomeExpenseChart
          expenses={expenses}
          income={income}
        />

        <CategoryPieChart
          expenses={expenses}
        />

      </div>

      <div className="mt-8">

        <MonthlyTrendChart
          expenses={expenses}
        />

      </div>

      <div className="mt-8">

        <SmartInsights
          expenses={expenses}
        />

      </div>

    </AppLayout>
  );
}

export default Analytics;