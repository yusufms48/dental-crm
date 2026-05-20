import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  addPatient,
  updatePatient,
  deletePatient,
} from "../../features/patients/patientsSlice";
import { deletePatientAppointments } from "../../features/appointments/appointmentsSlice";
import Modal from "../../components/Modal/Modal";
import ConfirmModal from "../../components/Modal/ConfirmModal";

const emptyForm = {
  name: "",
  phone: "",
  birthDate: "",
  allergies: "",
  chronicDiseases: "",
  medications: "",
  bloodType: "",
};

export default function Patients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patients = useSelector((state) => state.patients.patients);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmId, setConfirmId] = useState(null);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditingPatient(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (patient) => {
    setEditingPatient(patient);
    setForm({
      name: patient.name,
      phone: patient.phone,
      birthDate: patient.birthDate,
      allergies: patient.allergies || "",
      chronicDiseases: patient.chronicDiseases || "",
      medications: patient.medications || "",
      bloodType: patient.bloodType || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setConfirmId(id);
  };

  const confirmDelete = () => {
    dispatch(deletePatient(confirmId));
    dispatch(deletePatientAppointments(confirmId));
    setConfirmId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPatient) {
      dispatch(updatePatient({ ...editingPatient, ...form }));
    } else {
      dispatch(addPatient({ id: uuidv4(), ...form }));
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Пациенты</h1>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Добавить пациента
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по имени..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          {search
            ? "Пациенты не найдены"
            : "Пациентов пока нет. Добавьте первого!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <h2
                  className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  {patient.name}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(patient)}
                    className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">📞 {patient.phone}</p>
              <p className="text-sm text-gray-500">
                🎂 {patient.birthDate.split("-").reverse().join(".")}
              </p>
              {patient.allergies && (
                <p className="text-sm text-red-400">⚠️ {patient.allergies}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {confirmId && (
        <ConfirmModal
          message="Удалить пациента и все его записи? Это действие нельзя отменить."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {showModal && (
        <Modal
          title={editingPatient ? "Редактировать пациента" : "Новый пациент"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ФИО *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d+\-\s]/g, "");
                  setForm({ ...form, phone: val });
                }}
                placeholder="+994 50 123 45 67"
                pattern="\+994\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}"
                title="Формат: +994 50 123 45 67"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата рождения
              </label>
              <input
                type="date"
                value={form.birthDate}
                max={
                  new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setForm({ ...form, birthDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Группа крови
              </label>
              <select
                value={form.bloodType}
                onChange={(e) =>
                  setForm({ ...form, bloodType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Не указана</option>
                <option value="I+">I (O) Rh+</option>
                <option value="I-">I (O) Rh-</option>
                <option value="II+">II (A) Rh+</option>
                <option value="II-">II (A) Rh-</option>
                <option value="III+">III (B) Rh+</option>
                <option value="III-">III (B) Rh-</option>
                <option value="IV+">IV (AB) Rh+</option>
                <option value="IV-">IV (AB) Rh-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Аллергии
              </label>
              <textarea
                value={form.allergies}
                onChange={(e) =>
                  setForm({ ...form, allergies: e.target.value })
                }
                rows={2}
                placeholder="Например: аллергия на лидокаин..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Хронические заболевания
              </label>
              <textarea
                value={form.chronicDiseases}
                onChange={(e) =>
                  setForm({ ...form, chronicDiseases: e.target.value })
                }
                rows={2}
                placeholder="Например: сахарный диабет, гипертония..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Принимаемые лекарства
              </label>
              <textarea
                value={form.medications}
                onChange={(e) =>
                  setForm({ ...form, medications: e.target.value })
                }
                rows={2}
                placeholder="Например: метформин 500мг..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {editingPatient ? "Сохранить" : "Добавить"}
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
