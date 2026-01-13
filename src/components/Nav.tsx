import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/tasks", label: "Tasks" },
  { to: "/teams", label: "Teams" },
  { to: "/edit", label: "Edit" },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-8">
          {/* Logo/Brand */}
          <img
            className="rounded-xl h-12 w-12"
            src="https://cdn.discordapp.com/icons/1424754446012776530/ed302b20f513922b9fff4755f8311005.webp?size=64"
          />
          <span className="text-white font-bold text-lg">BZ Bingo</span>

          {/* Nav Links */}
          <div className="flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
