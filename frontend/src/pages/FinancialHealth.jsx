import { useEffect, useState } from "react";
import API from "../services/api";

import AppLayout from "../components/layout/AppLayout";
import HealthScoreCard from "../components/financialHealth/HealthScoreCard";
import SavingsRateCard from "../components/financialHealth/SavingsRateCard";
import ExpenseRatioCard from "../components/financialHealth/ExpenseRatioCard";
import HealthGauge from "../components/financialHealth/HealthGauge";
import Recommendations from "../components/financialHealth/Recommendations";

function FinancialHealth() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/income", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncome(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchIncome();
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