import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Income",
      path: "/income",
      icon: "💰",
    },
    {
      name: "Budget Planner",
      path: "/budget",
      icon: "📅",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "📊",
    },
    {
      name: "Reports",
      path: "/reports",
      icon: "📄",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
    },
  ];

  return (
    <div
      style={{
        width: "240px",
        background: "#0F172A",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            padding: "25px",
            borderBottom: "1px solid #1E293B",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#22C55E",
            }}
          >
            💰 SpendWise
          </h2>

          <p
            style={{
              color: "#94A3B8",
              fontSize: "13px",
              marginTop: "5px",
            }}
          >
            Personal Finance
          </p>
        </div>

        <div
          style={{
            padding: "15px",
          }}
        >
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "block",
                padding: "12px 15px",
                marginBottom: "8px",
                borderRadius: "10px",
                textDecoration: "none",

                color:
                  location.pathname === item.path
                    ? "#FFFFFF"
                    : "#CBD5E1",

                background:
                  location.pathname === item.path
                    ? "#14B8A6"
                    : "transparent",

                transition: "0.3s",
              }}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #1E293B",
        }}
      >
        <div
          style={{
            background: "#1E293B",
            padding: "12px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              color: "#22C55E",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            ₹0
          </div>

          <small
            style={{
              color: "#94A3B8",
            }}
          >
            Total Balance
          </small>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;