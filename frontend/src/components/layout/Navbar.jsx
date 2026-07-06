import { Bell, Search } from "lucide-react";
import AddExpenseModal from "../transaction/AddExpenseModal";

function Navbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        boxShadow: "0 2px 5px rgba(0,0,0,.08)",
      }}
    >
      <h2>Dashboard</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Search size={20} />

        <Bell size={20} />

        <AddExpenseModal />
      </div>
    </div>
  );
}

export default Navbar;