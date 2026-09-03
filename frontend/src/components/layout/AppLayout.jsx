import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { balance } = useData();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        balance={balance}
      />

      <div
        className="min-h-screen"
        style={{
          marginLeft: isDesktop ? "256px" : "0px",
          transition: "margin-left 0.3s",
        }}
      >
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="bg-background p-4 text-foreground transition-colors sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;