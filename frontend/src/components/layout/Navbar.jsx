import {
  Menu,
  Search,
  User,
  Moon,
  Sun,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import NotificationBell from "../notifications/NotificationBell";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { darkMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

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

  return (
    <header className="flex w-full items-center justify-between gap-2 overflow-x-auto px-4 py-4 sm:px-6">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          className="shrink-0 text-foreground lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={26} strokeWidth={2.25} color="currentColor" />
        </button>

        <div>
          <p className="text-sm text-muted-foreground">
            {greeting}
          </p>

          <h2 className="text-2xl font-bold text-foreground">
            {t("dashboard")}
          </h2>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:gap-5">

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
          className="shrink-0 rounded-xl bg-muted px-3 py-2 text-sm font-medium text-foreground outline-none"
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
        </select>

        {/* THEME */}
        <button
          onClick={toggleTheme}
          className="shrink-0 rounded-xl bg-muted p-3 transition hover:opacity-80"
        >
          {darkMode ? (
            <Sun
              size={22}
              strokeWidth={2.25}
              color="#eab308"
              className="shrink-0"
            />
          ) : (
            <Moon
              size={22}
              strokeWidth={2.25}
              color="currentColor"
              className="shrink-0 text-foreground"
            />
          )}
        </button>

        {/* NOTIFICATION */}
        <NotificationBell />

        {/* PROFILE */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <User size={20} className="shrink-0" />
          </div>

          <div className="hidden md:block">
            <p className="font-semibold text-foreground">
              Welcome
            </p>

            <p className="text-sm text-muted-foreground">
              SpendWise User
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;