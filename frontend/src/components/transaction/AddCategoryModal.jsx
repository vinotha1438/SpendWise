import { useState } from "react";
import API from "../../services/api";

function AddCategoryModal({ onClose, onSuccess }) {
  const [categoryName, setCategoryName] = useState("");
  const [icon, setIcon] = useState("📁");

  const handleSave = async () => {
    if (!categoryName.trim()) {
      alert("Enter Category Name");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/categories",
        {
          category_name: categoryName,
          icon: icon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Category Added Successfully");

      onSuccess();
      onClose();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to add category"
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
      <h3>Add New Category</h3>

      <input
        type="text"
        placeholder="Category Name"
        className="w-full border rounded-lg p-2 mt-3"
        value={categoryName}
        onChange={(e) =>
          setCategoryName(e.target.value)
        }
      />

      <select
        className="w-full border rounded-lg p-2 mt-3"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
      >
        <option>📁</option>
        <option>🍔</option>
        <option>🚗</option>
        <option>🏋️</option>
        <option>🐶</option>
        <option>💻</option>
        <option>🎮</option>
        <option>📚</option>
        <option>🏠</option>
        <option>💡</option>
        <option>🥘</option>
        <option>🍲</option>
        <option>🍜</option>
        <option>🍕</option>
        <option>🍫</option>
        <option>☕</option>
        <option>⛽</option>
        <option>🍍</option>
        <option>🍹</option>
        <option>🥛</option>
        <option>🏍️</option>
        <option>🥚</option>
        <option>🧋</option>
        <option>🚆</option>
        <option>🚎</option>
        <option>🕶️</option>
        <option>🍄</option>
      </select>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <button
          onClick={handleSave}
          className="bg-teal-500 text-white rounded-lg px-4 py-2"
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="bg-gray-500 text-white rounded-lg px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddCategoryModal;