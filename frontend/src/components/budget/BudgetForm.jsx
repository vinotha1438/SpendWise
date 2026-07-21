import { useEffect, useState } from "react";
import API from "../../services/api";

function BudgetForm({ onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const saveBudget = async () => {
    if (!category || !budget) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const today = new Date();

      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const response = await API.post(
        "/budgets",
        {
          category,
          monthly_budget: budget,
          month,
          year,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      setCategory("");
      setBudget("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  return (
    <div
      style={{
        background: "#111827",
        padding: "20px",
        borderRadius: "15px",
        border: "1px solid #1F2937",
        marginBottom: "25px",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        Create Monthly Budget
      </h2>

      <select
        className="w-full border rounded-lg p-2 mb-3"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>

        {categories.map((item) => (
          <option
            key={item.id}
            value={item.category_name}
          >
            {item.icon} {item.category_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Monthly Budget"
        className="w-full border rounded-lg p-2 mb-3"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      <button
        onClick={saveBudget}
        className="w-full bg-green-600 text-white rounded-lg p-2"
      >
        Save Budget
      </button>
    </div>
  );
}

export default BudgetForm;