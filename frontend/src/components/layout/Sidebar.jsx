import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  balance = 0,
}) {
  const location = useLocation();
  const { darkMode } = useTheme();
  const { t } = useTranslation();

  const menu = [
    {
      name: t("dashboard"),
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: t("income"),
      path: "/income",
      icon: "💰",
    },
    {
      name: t("accounts"),
      path: "/accounts",
      icon: "🏦",
    },
    {
      name: t("budgetPlanner"),
      path: "/budget",
      icon: "📅",
    },
    {
      name: t("recurringExpenses"),
      path: "/recurring-expenses",
      icon: "🔁",
    },
    {
      name: t("goals"),
      path: "/goals",
      icon: "🎯",
    },
    {
      name: t("analytics"),
      path: "/analytics",
      icon: "📊",
    },
    {
      name: t("reports"),
      path: "/reports",
      icon: "📄",
    },
    {
      name: t("financialHealth"),
      path: "/financial-health",
      icon: "❤️",
    },
    {
      name: t("settings"),
      path: "/settings",
      icon: "⚙️",
    },
  ];

  return (
    <>
      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-64
          flex
          flex-col
          justify-between
          overflow-y-auto
          transition-transform
          duration-300
          ${
            darkMode
              ? "bg-slate-950 text-white"
              : "bg-slate-900 text-white"
          }
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        <div>
          {/* LOGO */}
          <div className="border-b border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-emerald-400">
                  💰 SpendWise
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {t("personalFinance")}
                </p>
              </div>
            </div>
          </div>

          {/* MENU */}
          <nav className="p-4">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  mb-2
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  transition-all
                  ${
                    location.pathname === item.path
                      ? "bg-emerald-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800"
                  }
                `}
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* BALANCE */}
        <div className="border-t border-slate-700 p-5">
          <div className="rounded-2xl bg-slate-800 p-5">
            <p className="text-sm text-slate-400">
              {t("currentBalance")}
            </p>

            <h2
              className={`mt-2 text-3xl font-bold ${
                balance >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              ₹{balance.toLocaleString("en-IN")}
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              {t("liveBalance")}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;