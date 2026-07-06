function CategorySelect({ value, onChange }) {
  return (
    <select
      className="w-full border rounded-lg p-2 mt-3"
      value={value}
      onChange={onChange}
    >
      <option value="">Select Category</option>
      <option value="Food">🍔 Food</option>
      <option value="Travel">🚕 Travel</option>
      <option value="Shopping">🛍 Shopping</option>
      <option value="Bills">💡 Bills</option>
      <option value="Entertainment">🎬 Entertainment</option>
      <option value="Health">🏥 Health</option>
      <option value="Education">📚 Education</option>
      <option value="Office">💼 Office</option>
      <option value="Home">🏠 Home</option>
      <option value="Others">📦 Others</option>
    </select>
  );
}

export default CategorySelect;