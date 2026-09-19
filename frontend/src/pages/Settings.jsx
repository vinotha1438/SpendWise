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

  // Profile edit
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setNameInput(response.data?.full_name || "");
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

  const handleSaveProfile = async () => {
    if (!nameInput.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setSavingProfile(true);

      const token = localStorage.getItem("token");

      await API.put(
        "/profile",
        { full_name: nameInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully");
      setEditingProfile(false);
      fetchProfile();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password don't match");
      return;
    }

    try {
      setSavingPassword(true);

      const token = localStorage.getItem("token");

      await API.put(
        "/profile/password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Password changed successfully");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setSavingPassword(false);
    }
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

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                👤 Profile
              </h2>

              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="text-sm font-semibold text-emerald-600 hover:underline"
                >
                  ✏️ Edit
                </button>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Name
                  </label>

                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {savingProfile ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => {
                      setEditingProfile(false);
                      setNameInput(user?.full_name || "");
                    }}
                    className="rounded-xl bg-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
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
            )}

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

          {/* Security */}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                🔑 Security
              </h2>

              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-sm font-semibold text-emerald-600 hover:underline"
                >
                  Change Password
                </button>
              )}
            </div>

            {showPasswordForm ? (
              <div className="space-y-4">

                {user?.has_password && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Current Password
                    </label>

                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    New Password
                  </label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleChangePassword}
                    disabled={savingPassword}
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {savingPassword ? "Saving..." : "Update Password"}
                  </button>

                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="rounded-xl bg-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Keep your account secure by using a strong password.
              </p>
            )}

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