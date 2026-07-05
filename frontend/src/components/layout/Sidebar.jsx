import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Settings,
  Receipt,
  Target,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    icon: Wallet,
  },
  {
    title: "Analytics",
    icon: PieChart,
  },
  {
    title: "Budget",
    icon: Target,
  },
  {
    title: "Reports",
    icon: Receipt,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        background: "#0F172A",
        color: "white",
        padding: "20px",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            color: "#14B8A6",
            fontWeight: "700",
          }}
        >
          💰 SpendWise
        </h2>

        <p
          style={{
            fontSize: "13px",
            color: "#94A3B8",
          }}
        >
          Personal Finance
        </p>
      </div>

      {/* Menu */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              onClick={() => setActiveMenu(item.title)}
              style={{
                 display: "flex",
                 alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background:
                    activeMenu === item.title ? "#7f14b8" : "transparent",
                  color:
                    activeMenu === item.title ? "#FFFFFF" : "#CBD5E1",
                  transition: "0.25s",
                }}
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}

export default Sidebar;