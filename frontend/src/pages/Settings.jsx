import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";

function Settings() {
  const navigate = useNavigate();

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
      toast.error(error.response?.data?.message || "Failed to load profile");
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
      <div style={{ padding: "25px" }}>
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "25px",
          }}
        >
          ⚙️ Settings
        </h1>

        <div style={cardStyle}>
          <h2>👤 Profile</h2>

          <div style={rowStyle}>
            <span>Name</span>
            <strong>{user?.full_name}</strong>
          </div>

          <div style={rowStyle}>
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>
        </div>

        <div style={cardStyle}>
          <h2>🎨 Preferences</h2>

          <div style={rowStyle}>
            <span>Currency</span>
            <strong>₹ INR</strong>
          </div>

          <div style={rowStyle}>
            <span>Theme</span>
            <strong>Coming Soon</strong>
          </div>

          <div style={rowStyle}>
            <span>Date Format</span>
            <strong>DD/MM/YYYY</strong>
          </div>
        </div>

        <div style={cardStyle}>
          <h2>ℹ️ About</h2>

          <div style={rowStyle}>
            <span>Version</span>
            <strong>1.0.0</strong>
          </div>

          <div style={rowStyle}>
            <span>Technology</span>
            <strong>React + Node + MySQL</strong>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "#EF4444",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </AppLayout>
  );
}

const cardStyle = {
  background: "#111827",
  color: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "15px",
  borderBottom: "1px solid #374151",
  paddingBottom: "10px",
};

export default Settings;