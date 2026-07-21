const db = require("../config/db");

// Get Categories
const getCategories = (req, res) => {
  const sql = `
    SELECT *
    FROM categories
    WHERE user_id = ?
    ORDER BY category_name ASC
  `;

  db.query(sql, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch categories",
      });
    }

    res.json(rows);
  });
};

// Add Category
const addCategory = (req, res) => {
  const { category_name, icon } = req.body;

  const sql = `
    INSERT INTO categories
    (user_id, category_name, icon)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      req.user.id,
      category_name,
      icon || "📁",
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to add category",
        });
      }

      res.status(201).json({
        message: "Category Added Successfully",
      });
    }
  );
};

// Delete Category
const deleteCategory = (req, res) => {
  const sql = `
    DELETE FROM categories
    WHERE id=? AND user_id=?
  `;

  db.query(
    sql,
    [req.params.id, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Delete Failed",
        });
      }

      res.json({
        message: "Category Deleted",
      });
    }
  );
};

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
};