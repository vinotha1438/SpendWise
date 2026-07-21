import TransactionTable from "../transaction/TransactionTable";

function ExpenseSection({
  expenses,
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  onDelete,
  onEdit,
}) {
  return (
    <div
      style={{
        marginTop: "30px",
        background: "#111827",
        padding: "20px",
        borderRadius: "15px",
        border: "1px solid #1F2937",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search Expense..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #374151",
            background: "#1F2937",
            color: "white",
          }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #374151",
            background: "#1F2937",
            color: "white",
          }}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Office">Office</option>
          <option value="Home">Home</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <TransactionTable
        expenses={expenses}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  );
}

export default ExpenseSection;