import { calcAge, ageLabel } from "../../utils/calcAge";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  updateAppointment,
  deleteAppointment,
  addAppointment,
} from "../../features/appointments/appointmentsSlice";
import Modal from "../../components/Modal/Modal";
import ConfirmModal from "../../components/Modal/ConfirmModal";

const emptyForm = {
  date: "",
  time: "",
  reason: "",
  status: "upcoming",
};

const statusLabel = {
  upcoming: { text: "Предстоит", color: "bg-blue-100 text-blue-700" },
  completed: { text: "Завершён", color: "bg-green-100 text-green-700" },
  cancelled: { text: "Отменён", color: "bg-red-100 text-red-700" },
};

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const patient = useSelector((state) =>
    state.patients.patients.find((p) => p.id === id),
  );
  const appointments = useSelector((state) =>
    state.appointments.appointments.filter((a) => a.patientId === id),
  ).sort((a, b) => b.date.localeCompare(a.date));

  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmId, setConfirmId] = useState(null);

  if (!patient) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Пациент не найден</p>
        <button
          onClick={() => navigate("/patients")}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  const openAdd = () => {
    setEditingAppointment(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (appointment) => {
    setEditingAppointment(appointment);
    setForm({
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
      dispatch(addAppointment({ id: uuidv4(), patientId: id, ...form }));
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    dispatch(deleteAppointment(confirmId));
    setConfirmId(null);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <button
        onClick={() => navigate("/patients")}
        className="text-sm text-gray-500 mb-6 flex items-center gap-1 hover:opacity-70 transition-opacity"
        style={{ color: "#64748b" }}
      >
        ← Назад к пациентам
      </button>

      {/* Карточка пациента */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
          <div className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium ml-4">
            {appointments.length}{" "}
            {appointments.length === 1
              ? "визит"
              : appointments.length >= 2 && appointments.length <= 4
                ? "визита"
                : "визитов"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Левая колонка — основная информация */}
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-900 mb-2">
              Основная информация
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-600">Телефон:</span>{" "}
              {patient.phone}
            </p>
            {patient.birthDate && (
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-600">
                  Дата рождения:
                </span>{" "}
                {patient.birthDate.split("-").reverse().join(".")}{" "}
                <span className="text-gray-400">
                  ({ageLabel(calcAge(patient.birthDate))})
                </span>
              </p>
            )}
            {patient.bloodType && (
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-600">Группа крови:</span>{" "}
                {patient.bloodType}
              </p>
            )}
          </div>

          {/* Правая колонка — анамнез */}
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-900 mb-2">
              Анамнез жизни
            </p>
            {patient.allergies ? (
              <p className="text-sm text-gray-500">
                <span className="font-medium text-red-500">Аллергии:</span>{" "}
                {patient.allergies}
              </p>
            ) : (
              <p className="text-sm text-gray-400">Аллергии не указаны</p>
            )}
            {patient.chronicDiseases ? (
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-600">
                  Хр. заболевания:
                </span>{" "}
                {patient.chronicDiseases}
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                Хр. заболевания не указаны
              </p>
            )}
            {patient.medications ? (
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-600">Лекарства:</span>{" "}
                {patient.medications}
              </p>
            ) : (
              <p className="text-sm text-gray-400">Лекарства не указаны</p>
            )}
          </div>
        </div>
      </div>
      {/* История визитов */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">История визитов</h2>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Добавить визит
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Визитов пока нет
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-800">{a.reason}</p>
                <p className="text-sm text-gray-500">
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
          message="Удалить этот визит?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {showModal && (
        <Modal
          title={editingAppointment ? "Редактировать визит" : "Новый визит"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Например: удаление зуба, осмотр..."
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
