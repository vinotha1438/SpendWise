function Navbar() {
  return (

    <div
      style={{
        height: "70px",
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        boxShadow: "0 2px 5px rgba(0,0,0,.1)"
      }}
    >

      <h2>Dashboard</h2>

      <button
        style={{
          background: "#10B981",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px"
        }}
      >
        + Add Expense
      </button>

    </div>

  );
}

export default Navbar;