import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-bold text-blue-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Страница не найдена
        </h1>
        <p className="text-gray-500 mb-8">
          Страница которую вы ищете не существует
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}
