import IncomeTable from "../transaction/IncomeTable";

function IncomeSection({
  income,
  onEdit,
  onDelete,
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
      <h2
        style={{
          color: "white",
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        💰 Income History
      </h2>

      <IncomeTable
        income={income}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

export default IncomeSection;