import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout({ onLogout }) {
  return (
    <div className="flex h-screen bg-slate-200">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
