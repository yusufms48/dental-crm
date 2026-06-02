import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div className="text-center">
        <p className="text-8xl font-bold mb-4" style={{ color: "#38bdf8" }}>
          404
        </p>
        <h1 className="text-2xl font-bold text-white mb-2">
          Страница не найдена
        </h1>
        <p className="mb-8" style={{ color: "#64748b" }}>
          Страница которую вы ищете не существует
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-white px-6 py-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#38bdf8", color: "#0f172a" }}
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}
