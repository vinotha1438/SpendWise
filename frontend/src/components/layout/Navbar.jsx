import { Bell, Menu, Search } from "lucide-react";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-6">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-white">
            SpendWise
          </h1>

          <p className="text-xs text-slate-400 hidden md:block">
            Personal Finance Dashboard
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="hidden md:flex items-center bg-slate-800 rounded-lg px-3 py-2 w-64">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-white ml-2 w-full placeholder:text-slate-400"
          />
        </div>

        {/* Notification */}
        <button className="text-white hover:text-emerald-400 transition">
          <Bell size={20} />
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
          S
        </div>
      </div>

    </header>
  );
}

export default Navbar;