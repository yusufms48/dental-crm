import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../features/appointments/appointmentsSlice";
import Modal from "../../components/Modal/Modal";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import PatientSearch from "../../components/PatientSearch/PatientSearch";
import { DOCTORS } from "../../utils/doctors";
import Toast from "../../components/Toast/Toast";
import { useToast } from "../../hooks/useToast";

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
  doctorId: "",
};

export default function Appointments() {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.appointments);
  const patients = useSelector((state) => state.patients.patients);

  const location = useLocation();
  const [filter, setFilter] = useState(location.state?.filter || "all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmId, setConfirmId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { toast, showToast } = useToast();

  const today = new Date().toISOString().split("T")[0];

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Неизвестен";
  };

  const getDoctorName = (doctorId) => {
    const doctor = DOCTORS.find((d) => d.id === doctorId);
    return doctor ? doctor.name : null;
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
    setSubmitted(false);
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
      doctorId: appointment.doctorId || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!form.patientId) return;
    if (editingAppointment) {
      dispatch(updateAppointment({ ...editingAppointment, ...form }));
      showToast("Запись обновлена");
    } else {
      dispatch(addAppointment({ id: uuidv4(), ...form }));
      showToast("Запись добавлена");
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    dispatch(deleteAppointment(confirmId));
    setConfirmId(null);
    showToast("Запись удалена", "error");
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
        <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
          Записи на приём
        </h1>
        <button
          onClick={openAdd}
          className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#38bdf8" }}
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
                ? "text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            style={filter === btn.key ? { backgroundColor: "#38bdf8" } : {}}
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
                {getDoctorName(a.doctorId) && (
                  <p className="text-sm text-gray-500">
                    {getDoctorName(a.doctorId)}
                  </p>
                )}
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
              <PatientSearch
                patients={patients}
                value={form.patientId}
                onChange={(id) => setForm({ ...form, patientId: id })}
              />
              {!form.patientId && submitted && (
                <p className="text-xs text-red-400 mt-1">Выберите пациента</p>
              )}
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
                Врач *
              </label>
              <select
                required
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите врача</option>
                {DOCTORS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialty}
                  </option>
                ))}
              </select>
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
                className="flex-1 text-white py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#38bdf8" }}
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
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
