import { useMemo, useState } from "react";
import { useData } from "../context/DataContext";

import AppLayout from "../components/layout/AppLayout";
import AnalyticsCards from "../components/analytics/AnalyticsCards";
import IncomeExpenseChart from "../components/analytics/IncomeExpenseChart";
import CategoryPieChart from "../components/analytics/CategoryPieChart";
import MonthlyTrendChart from "../components/analytics/MonthlyTrendChart";
import SmartInsights from "../components/analytics/SmartInsights";
import AnalyticsFilter from "../components/analytics/AnalyticsFilter";

function Analytics() {
  const { expenses, income } = useData();

  const [filter, setFilter] = useState("All");

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  const today = new Date();

  const checkPeriod = (date) => {
    if (!date) return false;

    switch (filter) {
      case "Today":
        return (
          date.toDateString() === today.toDateString()
        );

      case "This Week": {
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());

        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        return date >= start && date <= end;
      }

      case "This Month":
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );

      case "This Year":
        return (
          date.getFullYear() === today.getFullYear()
        );

      default:
        return true;
    }
  };

  const checkDateRange = (date) => {
    if (
      !dateRange.fromDate ||
      !dateRange.toDate
    ) {
      return true;
    }

    const from = new Date(dateRange.fromDate);
    const to = new Date(dateRange.toDate);

    to.setHours(23, 59, 59, 999);

    return date >= from && date <= to;
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const date = new Date(item.expense_date);

      return (
        checkPeriod(date) &&
        checkDateRange(date)
      );
    });
  }, [expenses, filter, dateRange]);

  const filteredIncome = useMemo(() => {
    return income.filter((item) => {
      const date = new Date(item.income_date);

      return (
        checkPeriod(date) &&
        checkDateRange(date)
      );
    });
  }, [income, filter, dateRange]);

  return (
    <AppLayout
      expenses={filteredExpenses}
      income={filteredIncome}
    >
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h1 className="text-3xl font-bold text-slate-800">
          📊 Analytics Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Track your financial performance,
          spending patterns and monthly trends.
        </p>

      </div>

      <AnalyticsFilter
        value={filter}
        onChange={setFilter}
        onApplyDateRange={setDateRange}
      />

      <AnalyticsCards
        expenses={filteredExpenses}
        income={filteredIncome}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

        <IncomeExpenseChart
          expenses={filteredExpenses}
          income={filteredIncome}
        />

        <CategoryPieChart
          expenses={filteredExpenses}
        />

      </div>

      <div className="mt-8">

        <MonthlyTrendChart
          expenses={filteredExpenses}
        />

      </div>

      <div className="mt-8">

        <SmartInsights
          expenses={filteredExpenses}
        />

      </div>

    </AppLayout>
  );
}

export default Analytics;