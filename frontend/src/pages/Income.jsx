import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

import AppLayout from "../components/layout/AppLayout";
import AddIncomeModal from "../components/transaction/AddIncomeModal";
import IncomeTable from "../components/transaction/IncomeTable";

function Income() {
  const [income, setIncome] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [showIncomeModal, setShowIncomeModal] =
    useState(false);

  const [editingIncome, setEditingIncome] =
    useState(null);

  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/income", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncome(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const filteredIncome = useMemo(() => {
    return income.filter((item) => {
      const matchSearch = item.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === "" ||
        item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [income, search, selectedCategory]);

  const totalIncome = filteredIncome.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const today = new Date();

  const todayIncome = filteredIncome
    .filter((item) => {
      if (!item.income_date) return false;

      return (
        new Date(item.income_date).toDateString() ===
        today.toDateString()
      );
    })
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const thisMonthIncome = filteredIncome
    .filter((item) => {
      if (!item.income_date) return false;

      const d = new Date(item.income_date);

      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

  const averageIncome =
    filteredIncome.length > 0
      ? Math.round(
        totalIncome / filteredIncome.length
      )
      : 0;

  const deleteIncome = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/income/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchIncome();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Delete Failed"
      );
    }
  };

  const editIncome = (item) => {
    setEditingIncome(item);
    setShowIncomeModal(true);
  };

  return (
    <>
      {showIncomeModal && (
        <AddIncomeModal
          open={showIncomeModal}
          setOpen={setShowIncomeModal}
          incomeToEdit={editingIncome}
          onSuccess={() => {
            fetchIncome();
            setEditingIncome(null);
            setShowIncomeModal(false);
          }}
        />
      )}

      <AppLayout>

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              💰 Income Tracker
            </h1>

            <p className="mt-2 text-slate-500">
              Manage all your income in one place.
            </p>

          </div>

          <button
            onClick={() => {
              setEditingIncome(null);
              setShowIncomeModal(true);
            }}
            className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600"
          >
            + Add Income
          </button>

        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-slate-500">
              Total Income
            </p>

            <h2 className="mt-3 text-3xl font-bold text-emerald-600">
              ₹{totalIncome.toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-slate-500">
              Today's Income
            </p>

            <h2 className="mt-3 text-3xl font-bold text-blue-600">
              ₹{todayIncome.toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-slate-500">
              This Month
            </p>

            <h2 className="mt-3 text-3xl font-bold text-purple-600">
              ₹{thisMonthIncome.toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-slate-500">
              Average Income
            </p>

            <h2 className="mt-3 text-3xl font-bold text-orange-500">
              ₹{averageIncome.toLocaleString("en-IN")}
            </h2>

          </div>

        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row">

          <input
            type="text"
            placeholder="🔍 Search Income..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
          />

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none"
          >
            <option value="">
              All Categories
            </option>

            <option>Salary</option>
            <option>Business</option>
            <option>Freelance</option>
            <option>Investment</option>
            <option>Gift</option>
            <option>Bonus</option>
            <option>Others</option>

          </select>

        </div>

        <IncomeTable
          income={filteredIncome}
          onEdit={editIncome}
          onDelete={deleteIncome}
        />

      </AppLayout>

    </>
  );
}

export default Income;