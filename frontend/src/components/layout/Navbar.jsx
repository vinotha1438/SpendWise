import {
  Menu,
  Search,
  User,
  Moon,
  Sun,
  Settings,
  LogOut,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import NotificationBell from "../notifications/NotificationBell";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { darkMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const location = useLocation();

  const pageTitles = {
    "/dashboard": "dashboard",
    "/income": "income",
    "/accounts": "accounts",
    "/goals": "goals",
    "/analytics": "analytics",
    "/reports": "reports",
    "/financial-health": "financialHealth",
    "/settings": "settings",
    "/budget": "budgetPlanner",
    "/recurring-expenses": "recurringExpenses",
  };

  const titleKey = pageTitles[location.pathname] || "dashboard";

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const hour = new Date().getHours();

  let greeting = "Good Evening 🌙";

  if (hour < 12) {
    greeting = "Good Morning ☀️";
  } else if (hour < 17) {
    greeting = "Good Afternoon 🌤️";
  }

  const currentLanguage =
    i18n?.resolvedLanguage || i18n?.language || "en";

  const changeLanguage = (language) => {
    if (i18n && typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(language);
    }
  };

  // Close profile dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfileOpen(false);
    navigate("/login");
  };

  const goToSettings = () => {
    setProfileOpen(false);
    navigate("/settings");
  };

  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-y-3 gap-x-2 px-4 py-4 sm:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          className="shrink-0 text-foreground lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={26} strokeWidth={2.25} color="currentColor" />
        </button>

        <div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {greeting}
          </p>

          <h2 className="text-lg font-bold text-foreground sm:text-2xl">
            {t(titleKey)}
          </h2>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-5">

        {/* SEARCH */}
        <div className="hidden items-center rounded-xl bg-muted px-3 py-2 lg:flex lg:w-64">
          <Search
            size={18}
            className="shrink-0 text-muted-foreground"
          />

          <input
            type="text"
            placeholder={t("search")}
            className="ml-3 w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* LANGUAGE */}
        <select
          value={
            currentLanguage.startsWith("ta")
              ? "ta"
              : "en"
          }
          onChange={(e) =>
            changeLanguage(e.target.value)
          }
          className="shrink-0 rounded-xl bg-muted px-2 py-2 text-xs font-medium text-foreground outline-none sm:px-3 sm:text-sm"
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
        </select>

        {/* THEME */}
        <button
          onClick={toggleTheme}
          className="shrink-0 rounded-xl bg-muted p-2 transition hover:opacity-80 sm:p-3"
        >
          {darkMode ? (
            <Sun
              size={20}
              strokeWidth={2.25}
              color="#eab308"
              className="shrink-0"
            />
          ) : (
            <Moon
              size={20}
              strokeWidth={2.25}
              color="currentColor"
              className="shrink-0 text-foreground"
            />
          )}
        </button>

        {/* NOTIFICATION */}
        <NotificationBell />

        {/* PROFILE */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white sm:h-10 sm:w-10">
              <User size={18} className="shrink-0" />
            </div>

            <div className="hidden md:block text-left">
              <p className="font-semibold text-foreground">
                Welcome
              </p>

              <p className="text-sm text-muted-foreground">
                SpendWise User
              </p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 z-50 mt-3 w-48 rounded-xl border border-border bg-card shadow-xl">
              <button
                onClick={goToSettings}
                className="flex w-full items-center gap-2 rounded-t-xl px-4 py-3 text-sm text-card-foreground hover:bg-muted"
              >
                <Settings size={16} />
                {t("settings")}
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-b-xl px-4 py-3 text-sm text-red-500 hover:bg-muted"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;