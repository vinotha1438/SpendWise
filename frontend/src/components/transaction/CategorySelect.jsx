import { useEffect, useState } from "react";
import API from "../../services/api";
import AddCategoryModal from "./AddCategoryModal";

function CategorySelect({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

      <button
        type="button"
        onClick={() => setShowModal(true)}
        style={{
          marginTop: "10px",
          color: "#14B8A6",
          fontWeight: "bold",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ➕ Add New Category
      </button>

      {showModal && (
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchCategories}
        />
      )}
    </>
  );
}

export default CategorySelect;