import { useEffect, useState } from "react";
import API from "../../services/api";
import { useTranslation } from "react-i18next";

function BudgetForm({
  budget: editingBudget,
  isEdit = false,
  onSuccess = () => {},
}) {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [icon, setIcon] = useState("📁");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingBudget) {
      setCategory(editingBudget.category);
      setBudget(editingBudget.monthly_budget);
    } else {
      setCategory("");
      setBudget("");
    }
  }, [editingBudget]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.log(error);
    }
  };

  const saveCategory = async () => {
    if (!newCategory.trim()) {
      alert(t("enterCategoryName"));
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

      alert(t("categoryAddedSuccessfully"));
    } catch (error) {
      alert(
        error.response?.data?.message ||
          t("failedToAddCategory")
      );
    }
  };

  const saveBudget = async () => {
    if (!category || !budget) {
      alert(t("pleaseFillAllFields"));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const today = new Date();

      if (isEdit) {
        await API.put(
          `/api/budgets/${editingBudget.id}`,
          {
            monthly_budget: Number(budget),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(t("budgetUpdatedSuccessfully"));
      } else {
        await API.post(
          "/api/budgets",
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

        alert(t("budgetSavedSuccessfully"));
      }

      setCategory("");
      setBudget("");

      onSuccess();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          t("saveFailed")
      );
    }
  };

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold text-slate-800 dark:text-slate-100">
        {isEdit
          ? t("updateBudget")
          : t("createMonthlyBudget")}
      </h2>

      <select
        className="mb-4 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">
          {t("selectCategory")}
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

      {!isEdit && (
        <>
          <button
            onClick={() =>
              setShowAddCategory(!showAddCategory)
            }
            className="mb-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            + {t("addNewCategory")}
          </button>

          {showAddCategory && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <input
                type="text"
                placeholder={t("categoryName")}
                className="mb-3 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value)
                }
              />

              <input
                type="text"
                placeholder={t("emoji")}
                className="mb-3 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={icon}
                onChange={(e) =>
                  setIcon(e.target.value)
                }
              />

              <button
                onClick={saveCategory}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700"
              >
                {t("saveCategory")}
              </button>
            </div>
          )}
        </>
      )}

      <input
        type="number"
        placeholder={t("monthlyBudget")}
        className="mb-4 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-800 placeholder-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        value={budget}
        onChange={(e) =>
          setBudget(e.target.value)
        }
      />

      <button
        onClick={saveBudget}
        className="w-full rounded-xl bg-emerald-600 p-3 font-semibold text-white hover:bg-emerald-700"
      >
        {isEdit
          ? t("updateBudget")
          : t("saveBudget")}
      </button>
    </div>
  );
}

export default BudgetForm;
