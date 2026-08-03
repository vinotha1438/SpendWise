import { useEffect, useState } from "react";
import API from "../../services/api";

function BudgetForm({ onSuccess = () => {} }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");

  const [showAddCategory, setShowAddCategory] =
    useState(false);

  const [newCategory, setNewCategory] =
    useState("");

  const [icon, setIcon] = useState("📁");

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

      setCategories(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.log(error);
    }
  };

  const saveCategory = async () => {
    if (!newCategory.trim()) {
      alert("Enter Category Name");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/categories",
        {
          category_name: newCategory,
          icon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCategories();

      setCategory(newCategory);
      setNewCategory("");
      setIcon("📁");
      setShowAddCategory(false);

      alert("Category Added Successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add category"
      );
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

      await API.post(
        "/budgets",
        {
          category,
          monthly_budget: Number(budget),
          month: today.getMonth() + 1,
          year: today.getFullYear(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Budget Saved Successfully");

      setCategory("");
      setBudget("");

      onSuccess();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save budget"
      );
    }
  };

  return (
    <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-2xl font-bold">
        Create Monthly Budget
      </h2>

      <select
        className="mb-4 w-full rounded-xl border p-3"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >
        <option value="">
          Select Category
        </option>

        {categories.map((item) => (
          <option
            key={item.id}
            value={item.category_name}
          >
            {item.icon} {item.category_name}
          </option>
        ))}
      </select>

      <button
        onClick={() =>
          setShowAddCategory(
            !showAddCategory
          )
        }
        className="mb-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
      >
        + Add New Category
      </button>

      {showAddCategory && (
        <div className="mb-4 rounded-xl border bg-slate-50 p-4">

          <input
            type="text"
            placeholder="Category Name"
            className="mb-3 w-full rounded-lg border p-3"
            value={newCategory}
            onChange={(e) =>
              setNewCategory(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Emoji (🍔)"
            className="mb-3 w-full rounded-lg border p-3"
            value={icon}
            onChange={(e) =>
              setIcon(e.target.value)
            }
          />

          <button
            onClick={saveCategory}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-white"
          >
            Save Category
          </button>

        </div>
      )}

      <input
        type="number"
        placeholder="Monthly Budget"
        className="mb-4 w-full rounded-xl border p-3"
        value={budget}
        onChange={(e) =>
          setBudget(e.target.value)
        }
      />

      <button
        onClick={saveBudget}
        className="w-full rounded-xl bg-emerald-600 p-3 font-semibold text-white hover:bg-emerald-700"
      >
        Save Budget
      </button>

    </div>
  );
}

export default BudgetForm;