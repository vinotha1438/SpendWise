import { useEffect, useState } from "react";
import API from "../services/api";

import AppLayout from "../components/layout/AppLayout";

function Income() {
  const [income, setIncome] = useState([]);

  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/income", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Income Response =", response.data);

      setIncome(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  return (
    <AppLayout>
      <h1>Income Tracker 💰</h1>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Source</th>
            <th align="left">Amount</th>
            <th align="left">Date</th>
          </tr>
        </thead>

        <tbody>
          {income.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>₹ {item.amount}</td>
              <td>{item.income_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppLayout>
  );
}

export default Income;