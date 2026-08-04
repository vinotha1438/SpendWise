import { useState } from "react";
import { useData } from "../../context/DataContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { balance } = useData();

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        balance={balance}
      />

      <div
        className="min-h-screen transition-all duration-300"
        style={{
          marginLeft: window.innerWidth >= 1024 ? "256px" : "0px",
        }}
      >
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;