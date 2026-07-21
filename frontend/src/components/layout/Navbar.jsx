import { Bell, Search } from "lucide-react";

function Navbar() {
  return (
    <div
      style={{
        height: "75px",
        background: "#111827",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        borderBottom: "1px solid #1F2937",
      }}
    >
      <div>
        <h2
          style={{
            color: "white",
            margin: 0,
          }}
        >
          SpendWise
        </h2>

        <small
          style={{
            color: "#94A3B8",
          }}
        >
          Personal Finance Dashboard
        </small>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1F2937",
            padding: "8px 15px",
            borderRadius: "10px",
            width: "250px",
          }}
        >
          <Search size={18} color="#94A3B8" />

          <input
            type="text"
            placeholder="Search..."
            style={{
              marginLeft: "10px",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              width: "100%",
            }}
          />
        </div>

        <Bell color="white" size={20} />

        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "#14B8A6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          S
        </div>
      </div>
    </div>
  );
}

export default Navbar;