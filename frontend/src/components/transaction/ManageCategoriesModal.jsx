import { useState } from "react";
import API from "../../services/api";
import AddCategoryModal from "./AddCategoryModal";

function ManageCategoriesModal({ categories, onClose, onChange }) {
  const [editingCategory, setEditingCategory] = useState(null);

  const handleDelete = async (category) => {
    const confirmDelete = window.confirm(
      `Delete "${category.category_name}"? Past transactions with this category won't be affected.`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/categories/${category.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onChange();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  };

  return (
    <div
      style={{
        border: "1px solid #374151",
        padding: "15px",
        borderRadius: "10px",
        marginTop: "15px",
      }}
    >
      <h3>Manage Categories</h3>

      {editingCategory ? (
        <AddCategoryModal
          editCategory={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={() => {
            setEditingCategory(null);
            onChange();
          }}
        />
      ) : (
        <>
          <div style={{ marginTop: "10px" }}>
            {categories.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #374151",
                }}
              >
                <span>
                  {item.icon} {item.category_name}
                </span>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setEditingCategory(item)}
                    className="bg-teal-500 text-white rounded-lg px-3 py-1"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="bg-red-500 text-white rounded-lg px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="bg-gray-500 text-white rounded-lg px-4 py-2 mt-3"
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}

export default ManageCategoriesModal;