import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

import API from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";

function Settings() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/login");
    }, 800);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            ⚙️ Settings
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your account and application settings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Profile */}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-foreground">
              👤 Profile
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between border-b border-border pb-3">

                <span className="text-muted-foreground">
                  Name
                </span>

                <span className="font-semibold text-foreground">
                  {user?.full_name}
                </span>

              </div>

              <div className="flex justify-between border-b border-border pb-3">

                <span className="text-muted-foreground">
                  Email
                </span>

                <span className="break-all text-right font-semibold text-foreground">
                  {user?.email}
                </span>

              </div>

            </div>

          </div>

          {/* Preferences */}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-foreground">
              🎨 Preferences
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between border-b border-border pb-3">

                <span className="text-muted-foreground">
                  Currency
                </span>

                <span className="font-semibold text-foreground">
                  ₹ INR
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-border pb-3">

                <span className="text-muted-foreground">
                  Theme
                </span>

                <button
                  onClick={toggleTheme}
                  className={`rounded-lg px-4 py-2 font-semibold text-white transition ${
                    darkMode
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-slate-500 hover:bg-slate-600"
                  }`}
                >
                  {darkMode ? "🌙 Dark" : "☀️ Light"}
                </button>

              </div>

              <div className="flex justify-between">

                <span className="text-muted-foreground">
                  Date Format
                </span>

                <span className="font-semibold text-foreground">
                  DD/MM/YYYY
                </span>

              </div>

            </div>

          </div>

          {/* About */}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-foreground">
              ℹ️ About
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between border-b border-border pb-3">

                <span className="text-muted-foreground">
                  Version
                </span>

                <span className="font-semibold text-foreground">
                  1.0.0
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-muted-foreground">
                  Technology
                </span>

                <span className="font-semibold text-foreground">
                  React + Node + MySQL
                </span>

              </div>

            </div>

          </div>

          {/* Account */}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-foreground">
              🔒 Account
            </h2>

            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              🚪 Logout
            </button>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}

export default Settings;