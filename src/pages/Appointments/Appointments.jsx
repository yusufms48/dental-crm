import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../features/appointments/appointmentsSlice";
import Modal from "../../components/Modal/Modal";
import ConfirmModal from "../../components/Modal/ConfirmModal";

const statusLabel = {
  upcoming: { text: "Предстоит", color: "bg-blue-100 text-blue-700" },
  completed: { text: "Завершён", color: "bg-green-100 text-green-700" },
  cancelled: { text: "Отменён", color: "bg-red-100 text-red-700" },
};

const emptyForm = {
  patientId: "",
  date: "",
  time: "",
  reason: "",
  status: "upcoming",
};

export default function Appointments() {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.appointments);
  const patients = useSelector((state) => state.patients.patients);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmId, setConfirmId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Неизвестен";
  };

  const filtered = appointments
    .filter((a) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "today"
            ? a.date === today
            : a.status === filter;

      const matchesSearch =
        getPatientName(a.patientId)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        a.reason.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.time.localeCompare(a.time);
    });

  const openAdd = () => {
    setEditingAppointment(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (appointment) => {
    setEditingAppointment(appointment);
    setForm({
      patientId: appointment.patientId,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAppointment) {
      dispatch(updateAppointment({ ...editingAppointment, ...form }));
    } else {
      dispatch(addAppointment({ id: uuidv4(), ...form }));
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    dispatch(deleteAppointment(confirmId));
    setConfirmId(null);
  };

  const filterButtons = [
    { key: "all", label: "Все" },
    { key: "today", label: "Сегодня" },
    { key: "upcoming", label: "Предстоящие" },
    { key: "completed", label: "Завершённые" },
    { key: "cancelled", label: "Отменённые" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Записи на приём</h1>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Добавить запись
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === btn.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по имени пациента или причине визита..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Список записей */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Записей не найдено
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {getPatientName(a.patientId)}
                </p>
                <p className="text-sm font-medium text-blue-400">{a.reason}</p>
                <p className="text-sm text-gray-400">
                  {a.date.split("-").reverse().join(".")} в {a.time}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusLabel[a.status].color}`}
                >
                  {statusLabel[a.status].text}
                </span>
                <button
                  onClick={() => openEdit(a)}
                  className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  Изменить
                </button>
                <button
                  onClick={() => setConfirmId(a.id)}
                  className="text-xs px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmId && (
        <ConfirmModal
          message="Удалить эту запись?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {showModal && (
        <Modal
          title={editingAppointment ? "Редактировать запись" : "Новая запись"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пациент *
              </label>
              <select
                required
                value={form.patientId}
                onChange={(e) =>
                  setForm({ ...form, patientId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите пациента</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата *
              </label>
              <input
                type="date"
                required
                value={form.date}
                min={today}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время *
              </label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Причина визита *
              </label>
              <input
                type="text"
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Например: осмотр, удаление зуба..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="upcoming">Предстоит</option>
                <option value="completed">Завершён</option>
                <option value="cancelled">Отменён</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {editingAppointment ? "Сохранить" : "Добавить"}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
