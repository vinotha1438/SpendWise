import { useState } from "react";
import API from "../../services/api";

function AddCategoryModal({ onClose, onSuccess, editCategory }) {
  const isEditMode = !!editCategory;

  const [categoryName, setCategoryName] = useState(
    editCategory?.category_name || ""
  );
  const [icon, setIcon] = useState(editCategory?.icon || "📁");

  const handleSave = async () => {
    if (!categoryName.trim()) {
      alert("Enter Category Name");
      return;
    }

    if (!icon.trim()) {
      alert("Choose an Emoji");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (isEditMode) {
        await API.put(
          `/categories/${editCategory.id}`,
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
        alert("Category Updated Successfully");
      } else {
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
      }

      onSuccess();
      onClose();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "add"} category`
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
      <h3>{isEditMode ? "Edit Category" : "Add New Category"}</h3>

      <input
        type="text"
        placeholder="Category Name"
        className="w-full border rounded-lg p-2 mt-3"
        value={categoryName}
        onChange={(e) =>
          setCategoryName(e.target.value)
        }
      />

      <div style={{ marginTop: "15px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>
          Choose an Emoji
        </label>

        <input
          type="text"
          placeholder="Type or paste an emoji (Win + . to open emoji picker)"
          className="w-full border rounded-lg p-2"
          value={icon}
          maxLength={4}
          onChange={(e) => setIcon(e.target.value)}
        />

        <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
          Press <strong>Win + .</strong> (Windows) or <strong>Cmd + Ctrl + Space</strong> (Mac) to open your emoji keyboard, then paste or pick any emoji here.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
          {["📁", "🍔", "🚗", "🏋️", "🐶", "💻", "🎮", "📚", "🏠", "💡", "☕", "⛽"].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              style={{
                fontSize: "20px",
                padding: "4px 8px",
                borderRadius: "6px",
                border: icon === emoji ? "2px solid #14B8A6" : "1px solid #374151",
                background: "none",
                cursor: "pointer",
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

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
          {isEditMode ? "Update" : "Save"}
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