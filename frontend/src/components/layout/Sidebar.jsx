import { Link, useLocation } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Income", path: "/income", icon: "💰" },
    { name: "Budget Planner", path: "/budget", icon: "📅" },
    { name: "Analytics", path: "/analytics", icon: "📊" },
    { name: "Reports", path: "/reports", icon: "📄" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  return (
    <aside
      className={`
        fixed lg:static
        top-0 left-0
        z-50
        h-screen
        w-64
        bg-slate-900
        text-white
        flex
        flex-col
        justify-between
        transition-transform
        duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
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
              className={`
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                mb-2
                transition-all
                duration-200

                ${
                  location.pathname === item.path
                    ? "bg-emerald-500 text-white shadow"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>

              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-5 border-t border-slate-800">
        <div className="rounded-xl bg-slate-800 p-4">
          <h3 className="text-emerald-400 text-2xl font-bold">
            ₹0
          </h3>

          <p className="text-slate-400 text-sm">
            Total Balance
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;