import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const patients = useSelector((state) => state.patients.patients);
  const appointments = useSelector((state) => state.appointments.appointments);

  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter((a) => a.date === today);
  const upcomingAppointments = appointments
    .filter((a) => a.date >= today && a.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const completedCount = appointments.filter(
    (a) => a.status === "completed",
  ).length;

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Неизвестен";
  };

  const statusLabel = {
    upcoming: { text: "Предстоит", color: "bg-sky-100 text-sky-700" },
    completed: { text: "Завершён", color: "bg-green-100 text-green-700" },
    cancelled: { text: "Отменён", color: "bg-red-100 text-red-700" },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Главная</h1>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div
          onClick={() => navigate("/patients")}
          className="bg-white rounded-xl shadow-sm p-5 border-l-4 cursor-pointer hover:shadow-md transition-shadow"
          style={{ borderColor: "#38bdf8" }}
        >
          <p className="text-sm text-gray-500">Всего пациентов</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#0f172a" }}>
            {patients.length}
          </p>
        </div>
        <div
          onClick={() => navigate("/appointments", { state: { filter: "completed" } })}
          className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-500">Завершённых приёмов</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {completedCount}
          </p>
        </div>
        <div
          onClick={() => navigate("/appointments", { state: { filter: "today" } })}
          className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-500 cursor-pointer hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-500">Записей на сегодня</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {todayAppointments.length}
          </p>
        </div>
      </div>

      {/* Сегодняшние записи */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#0f172a" }}>
          Записи на сегодня
        </h2>
        {todayAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm">На сегодня записей нет</p>
        ) : (
          <ul className="space-y-3">
            {todayAppointments.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: "#f1f5f9" }}
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {getPatientName(a.patientId)}
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#38bdf8" }}
                  >
                    {a.reason}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    {a.time}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusLabel[a.status].color}`}
                  >
                    {statusLabel[a.status].text}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ближайшие записи */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#0f172a" }}>
          Ближайшие записи
        </h2>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm">Нет предстоящих записей</p>
        ) : (
          <ul className="space-y-3">
            {upcomingAppointments.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: "#f1f5f9" }}
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {getPatientName(a.patientId)}
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#38bdf8" }}
                  >
                    {a.reason}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">
                    {a.date.split("-").reverse().join(".")}
                  </p>
                  <p className="text-sm text-gray-500">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
