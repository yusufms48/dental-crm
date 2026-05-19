import { useSelector } from "react-redux";

export default function Dashboard() {
  const patients = useSelector((state) => state.patients.patients);
  const appointments = useSelector((state) => state.appointments.appointments);

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
    upcoming: { text: "Предстоит", color: "bg-blue-100 text-blue-700" },
    completed: { text: "Завершён", color: "bg-green-100 text-green-700" },
    cancelled: { text: "Отменён", color: "bg-red-100 text-red-700" },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Главная</h1>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Всего пациентов</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {patients.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Завершённых приёмов</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {completedCount}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-500">
          <p className="text-sm text-gray-500">Записей на сегодня</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {todayAppointments.length}
          </p>
        </div>
      </div>

      {/* Сегодняшние записи */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Записи на сегодня
        </h2>
        {todayAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm">На сегодня записей нет</p>
        ) : (
          <ul className="space-y-3">
            {todayAppointments.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {getPatientName(a.patientId)}
                  </p>
                  <p className="text-sm text-gray-500">{a.reason}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    {a.time}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      statusLabel[a.status].color
                    }`}
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
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Ближайшие записи
        </h2>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm">Нет предстоящих записей</p>
        ) : (
          <ul className="space-y-3">
            {upcomingAppointments.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {getPatientName(a.patientId)}
                  </p>
                  <p className="text-sm text-gray-500">{a.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">{a.date}</p>
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
