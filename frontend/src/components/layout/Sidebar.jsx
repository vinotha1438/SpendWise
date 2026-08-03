import { Link, useLocation } from "react-router-dom";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  balance = 0,
}) {
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
      name: "Recurring Expenses",
      path: "/recurring-expenses",
      icon: "🔁",
    },
    {
      name: "Goals",
      path: "/goals",
      icon: "🎯",
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
    <aside
      className={`
        fixed
        top-0
        left-0
        z-50
        h-screen
        w-64
        bg-slate-900
        text-white
        flex
        flex-col
        justify-between
        overflow-y-auto
        transition-transform
        duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        lg:translate-x-0
      `}
    >
      <div>
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-emerald-400">
            💰 SpendWise
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Personal Finance
          </p>
        </div>

        <nav className="p-4">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-2 transition-all ${
                location.pathname === item.path
                  ? "bg-emerald-500 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-5 border-t border-slate-800">
        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-400 text-sm">
            Current Balance
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${
              balance >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            ₹{balance.toLocaleString("en-IN")}
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            Live Balance
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;