import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Главная", icon: "🏠" },
  { to: "/patients", label: "Пациенты", icon: "👤" },
  { to: "/appointments", label: "Записи", icon: "📅" },
  { to: "/price-list", label: "Прайс-лист", icon: "💰∆" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">🦷 Dental CRM</h1>
        <p className="text-xs text-gray-500 mt-1">Система учёта пациентов</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t text-xs text-gray-400 text-center">
        Dental CRM © 2026
      </div>
    </aside>
  );
}
