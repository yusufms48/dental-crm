import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  DollarSign,
  LogOut,
} from "lucide-react";

const links = [
  { to: "/", label: "Главная", icon: LayoutDashboard },
  { to: "/patients", label: "Пациенты", icon: Users },
  { to: "/appointments", label: "Записи", icon: CalendarDays },
  { to: "/price-list", label: "Прайс-лист", icon: DollarSign },
];

export default function Sidebar({ onLogout }) {
  return (
    <aside
      className="w-64 flex flex-col"
      style={{ backgroundColor: "#0f172a" }}
    >
      {/* Логотип — кликабельный */}
      <Link
        to="/"
        className=" border-b border-white/10 hover:bg-white/5 transition-colors"
      >
        <img
          src="/logo.svg"
          alt="DenT²al logo"
          style={{ width: "100%", height: "auto" }}
        />
      </Link>

      {/* Навигация */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                      isActive
                        ? "font-medium"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { backgroundColor: "#38bdf8", color: "#0f172a" }
                      : {}
                  }
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Выйти */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors text-slate-400 hover:text-red-400 hover:bg-white/5"
        >
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
        <p className="text-xs text-center mt-3" style={{ color: "#334155" }}>
          DenT²al © 2026
        </p>
      </div>
    </aside>
  );
}
