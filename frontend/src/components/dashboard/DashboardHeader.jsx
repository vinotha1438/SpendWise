import AddExpenseModal from "../transaction/AddExpenseModal";

function DashboardHeader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        background: "#111827",
        padding: "20px",
        borderRadius: "15px",
        border: "1px solid #1F2937",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            color: "white",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            color: "#94A3B8",
            marginTop: "8px",
          }}
        >
          Track your expenses and manage your finances.
        </p>
      </div>

      <AddExpenseModal />
    </div>
  );
}

export default DashboardHeader;