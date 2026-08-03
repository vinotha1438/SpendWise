import { Bell, Menu, Search, User } from "lucide-react";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const hour = new Date().getHours();

  let greeting = "Good Evening 🌙";

  if (hour < 12) greeting = "Good Morning ☀️";
  else if (hour < 17) greeting = "Good Afternoon 🌤️";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          className="lg:hidden text-slate-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={26} />
        </button>

        <div>
          <p className="text-sm text-slate-500">
            {greeting}
          </p>

          <h2 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h2>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="hidden lg:flex items-center w-64 rounded-xl bg-slate-100 px-3 py-2">

          <Search
            size={18}
            className="text-slate-500"
          />

          <input
            type="text"
            placeholder="Search expenses..."
            className="bg-transparent outline-none ml-3 w-full text-slate-700 placeholder:text-slate-400"
          />

        </div>

        {/* Notification */}

        <button className="relative p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition">

          <Bell
            size={20}
            className="text-slate-700"
          />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

        </button>

        {/* Profile */}

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
            <User size={20} />
          </div>

          <div className="hidden md:block">

            <p className="font-semibold text-slate-800">
              Welcome
            </p>

            <p className="text-sm text-slate-500">
              SpendWise User
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;