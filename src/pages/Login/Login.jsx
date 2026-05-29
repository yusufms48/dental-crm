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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div className="w-full max-w-sm">
        {/* Логотип */}
        <div className="mb-8 text-center">
          <img
            src="/logo.svg"
            alt="DenT²al logo"
            className="mx-auto mb-4"
            style={{ width: "400px", height: "auto" }}
          />
        </div>

        {/* Форма */}
        <div className="rounded-xl p-8" style={{ backgroundColor: "#1e293b" }}>
          <h2 className="text-white text-lg font-semibold mb-6 text-center">
            Вход в систему
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#94a3b8" }}
              >
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
                className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  focusRingColor: "#38bdf8",
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#94a3b8" }}
              >
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
                className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg text-sm font-medium transition-colors mt-2"
              style={{ backgroundColor: "#38bdf8", color: "#0f172a" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0ea5e9")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#38bdf8")}
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
