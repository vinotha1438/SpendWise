import { useEffect, useState } from "react";
import API from "../../services/api";
import AddCategoryModal from "./AddCategoryModal";
import ManageCategoriesModal from "./ManageCategoriesModal";

function CategorySelect({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <select
        className="w-full border rounded-lg p-2"
        value={value}
        onChange={onChange}
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

      <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            color: "#14B8A6",
            fontWeight: "bold",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ➕ Add New Category
        </button>

        <button
          type="button"
          onClick={() => setShowManageModal(true)}
          style={{
            color: "#6B7280",
            fontWeight: "bold",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ⚙️ Manage Categories
        </button>
      </div>

      {showModal && (
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchCategories}
        />
      )}

      {showManageModal && (
        <ManageCategoriesModal
          categories={categories}
          onClose={() => setShowManageModal(false)}
          onChange={fetchCategories}
        />
      )}
    </>
  );
}

export default CategorySelect;