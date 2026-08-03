import { useState } from "react";
import { useData } from "../../context/DataContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { balance } = useData();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        balance={balance}
      />

      <div
        className="min-h-screen"
        style={{
          marginLeft: "16rem",
          width: "calc(100% - 16rem)",
        }}
      >

        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          style={{
            width: "100%",
            padding: "24px",
          }}
        >
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppLayout;