import { useState } from "react";

const CREDENTIALS = {
  username: "admin",
  password: "dental2026",
};

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      form.username.trim() === CREDENTIALS.username &&
      form.password.trim() === CREDENTIALS.password
    ) {
      localStorage.setItem("isAuthenticated", "true");
      onLogin();
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">🦷 Dental CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Система учёта пациентов</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Логин
            </label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => {
                setForm({ ...form, username: e.target.value });
                setError("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setError("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
